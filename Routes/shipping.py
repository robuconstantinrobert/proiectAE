from flask import Blueprint, request, jsonify
import requests
import logging

shipping_bp = Blueprint('shipping', __name__)

# Shippo API Key (replace with your own key)
SHIPPO_API_KEY = "shippo_test_7d47807bb667692db93c8bd3fd4554de71ec3639"

# Set up logging
logging.basicConfig(level=logging.DEBUG)

@shipping_bp.route('/rates', methods=['POST'])
def get_shipping_rates():
    """
    Fetch shipping rates based on provided addresses and parcel details.
    """
    data = request.json
    address_to = data.get('address_to')
    parcel = data.get('parcel') or {
        "length": 10,
        "width": 5,
        "height": 3,
        "distance_unit": "in",
        "weight": 2,
        "mass_unit": "lb"
    }

    # Validate input
    if not isinstance(address_to, dict) or not address_to.get("street1") or not address_to.get("zip"):
        return jsonify({"error": "Invalid or incomplete recipient address"}), 400

    if not isinstance(parcel, dict) or not parcel.get("weight") or not parcel.get("length"):
        return jsonify({"error": "Invalid or incomplete parcel details"}), 400

    address_from = {
        "name": "My Shop",
        "company": "My Shop LLC",
        "street1": "123 Sender St",
        "city": "New York",
        "state": "NY",
        "zip": "10001",
        "country": "US",
        "phone": "12345677890",
        "email": "info@myshop.com"
    }

    url = "https://api.goshippo.com/shipments/"
    headers = {"Authorization": f"ShippoToken {SHIPPO_API_KEY}"}
    payload = {
        "address_from": address_from,
        "address_to": address_to,
        "parcels": [parcel],
        "carrier_accounts": ["dc56ad76841e4772a8195db2c69a431e"],
        "async": False
    }

    payload.pop("carrier_accounts", None)

    try:
        response = requests.post(url, json=payload, headers=headers)
        response_data = response.json()

        logging.debug(f"Payload sent to Shippo: {payload}")
        logging.debug(f"Shippo response status: {response.status_code}")
        logging.debug(f"Response Data: {response_data}")

        if response.status_code == 201:
            # Extract and format the rates
            rates = []
            for rate in response_data.get('rates', []):
                rates.append({
                    "provider": rate.get("provider", "Unknown"),
                    "servicelevel": rate.get("servicelevel", {}).get("name", "Unknown Service"),
                    "currency": rate.get("currency", "USD"),
                    "amount": rate.get("amount", "0.00"),
                    "estimated_days": rate.get("estimated_days", "N/A")
                })

            return jsonify({"rates": rates}), 200
        else:
            error_message = response_data.get("detail", "Unknown error")
            messages = response_data.get("messages", [])
            if messages:
                error_message += f" | Messages: {messages}"
            return jsonify({"error": error_message}), response.status_code

    except Exception as e:
        logging.error(f"Exception occurred: {e}")
        return jsonify({"error": str(e)}), 500
