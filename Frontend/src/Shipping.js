import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Shipping.css'; // Create a CSS file for styling

const Shipping = () => {
    const [addressFrom, setAddressFrom] = useState({
        name: "",
        street1: "",
        city: "",
        state: "",
        zip: "",
        country: "US",
        phone: "",
    });

    const [addressTo, setAddressTo] = useState({
        name: "",
        street1: "",
        city: "",
        state: "",
        zip: "",
        country: "US",
        phone: "",
    });

    const [parcel, setParcel] = useState({
        length: "",
        width: "",
        height: "",
        weight: "",
    });

    const [shippingRates, setShippingRates] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleFetchRates = async () => {
        try {
            const response = await fetch("/api/shipping/rates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address_from: addressFrom, address_to: addressTo, parcel }),
            });

            if (response.ok) {
                const data = await response.json();
                setShippingRates(data.rates || []);
                setError("");
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Failed to fetch shipping rates");
            }
        } catch (err) {
            setError("An error occurred while fetching shipping rates");
        }
    };

    const handleConfirmShipping = (selectedRate) => {
        // Save the selected shipping rate and proceed
        localStorage.setItem("selectedShippingRate", JSON.stringify(selectedRate));
        navigate("/payment"); // Redirect to the payment page
    };

    return (
        <div className="shipping-container">
            <h2>Shipping Information</h2>
            <div className="form-section">
                <h3>Sender Address</h3>
                <input
                    type="text"
                    placeholder="Name"
                    value={addressFrom.name}
                    onChange={(e) => setAddressFrom({ ...addressFrom, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Street"
                    value={addressFrom.street1}
                    onChange={(e) => setAddressFrom({ ...addressFrom, street1: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="City"
                    value={addressFrom.city}
                    onChange={(e) => setAddressFrom({ ...addressFrom, city: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="State"
                    value={addressFrom.state}
                    onChange={(e) => setAddressFrom({ ...addressFrom, state: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="ZIP"
                    value={addressFrom.zip}
                    onChange={(e) => setAddressFrom({ ...addressFrom, zip: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Phone"
                    value={addressFrom.phone}
                    onChange={(e) => setAddressFrom({ ...addressFrom, phone: e.target.value })}
                />
            </div>

            <div className="form-section">
                <h3>Recipient Address</h3>
                <input
                    type="text"
                    placeholder="Name"
                    value={addressTo.name}
                    onChange={(e) => setAddressTo({ ...addressTo, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Street"
                    value={addressTo.street1}
                    onChange={(e) => setAddressTo({ ...addressTo, street1: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="City"
                    value={addressTo.city}
                    onChange={(e) => setAddressTo({ ...addressTo, city: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="State"
                    value={addressTo.state}
                    onChange={(e) => setAddressTo({ ...addressTo, state: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="ZIP"
                    value={addressTo.zip}
                    onChange={(e) => setAddressTo({ ...addressTo, zip: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Phone"
                    value={addressTo.phone}
                    onChange={(e) => setAddressTo({ ...addressTo, phone: e.target.value })}
                />
            </div>

            <div className="form-section">
                <h3>Parcel Details</h3>
                <input
                    type="text"
                    placeholder="Length (in)"
                    value={parcel.length}
                    onChange={(e) => setParcel({ ...parcel, length: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Width (in)"
                    value={parcel.width}
                    onChange={(e) => setParcel({ ...parcel, width: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Height (in)"
                    value={parcel.height}
                    onChange={(e) => setParcel({ ...parcel, height: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Weight (lb)"
                    value={parcel.weight}
                    onChange={(e) => setParcel({ ...parcel, weight: e.target.value })}
                />
            </div>

            <button onClick={handleFetchRates} className="fetch-rates-button">Get Shipping Rates</button>

            {error && <p className="error-message">{error}</p>}

            {shippingRates.length > 0 && (
                <div className="rates-section">
                    <h3>Available Shipping Rates</h3>
                    {shippingRates.map((rate, index) => (
                        <div key={index} className="rate-item">
                            <p>Provider: {rate.provider}</p>
                            <p>Service: {rate.servicelevel}</p>
                            <p>Cost: {rate.currency} {rate.amount}</p>
                            <p>Estimated Days: {rate.estimated_days}</p>
                            <button onClick={() => handleConfirmShipping(rate)}>Select</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Shipping;
