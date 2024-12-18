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
    address_to = data.get('address_to')  # Recipient address from the request
    parcel = data.get('parcel') or {
        "length": 10,  # Default parcel dimensions
        "width": 5,
        "height": 3,
        "distance_unit": "in",
        "weight": 2,
        "mass_unit": "lb"
    }

    # Validate input
    if not address_to:
        return jsonify({"error": "Missing recipient address"}), 400

    # Standard sender address
    address_from = {
        "name": "My Shop",
        "company": "My Shop LLC",
        "street1": "33 Bulevardul Corneliu Coposu, Sectorul 3, Sectorul 3",
        "city": "Bucuresti",
        "state": "Bucuresti",
        "zip": "030603",
        "country": "RO",
        "phone": "0773321171",
        "email": "hardgx1234@gmail.com"
    }

    # Shippo API request
    url = "https://api.goshippo.com/shipments/"
    headers = {"Authorization": f"ShippoToken {SHIPPO_API_KEY}"}
    payload = {
        "address_from": address_from,
        "address_to": address_to,
        "parcels": [parcel],
        "carrier_accounts": ["dc56ad76841e4772a8195db2c69a431e"],  # Add DHL Express carrier account ID here
        "async": False
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response_data = response.json()

        logging.debug(f"Response Data: {response_data}")

        if response.status_code == 201:
            # Successfully created, now check for errors in the response
            if 'messages' in response_data:
                # If there are error messages, return them
                return jsonify({"error": response_data.get("messages", "Unknown error")}), 400
            return jsonify(response_data), 200
        else:
            return jsonify({"error": response_data.get("detail", "Unknown error")}), response.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
