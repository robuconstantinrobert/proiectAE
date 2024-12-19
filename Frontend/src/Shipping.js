//import React, { useState } from "react";
//import { useNavigate } from "react-router-dom";
//import './Shipping.css'; // Create a CSS file for styling
//
//const Shipping = () => {
//    const [addressTo, setAddressTo] = useState({
//        name: "",
//        street1: "",
//        city: "",
//        state: "",
//        zip: "",
//        country: "US",
//    });
//
//    const [shippingRates, setShippingRates] = useState([]);
//    const [error, setError] = useState("");
//    const navigate = useNavigate();
//
//    const handleFetchRates = async () => {
//        try {
//            const response = await fetch("http://localhost:5000/api/shipping/rates", {
//                method: "POST",
//                headers: { "Content-Type": "application/json" },
//                body: JSON.stringify({ address_to: addressTo }),
//            });
//
//            if (response.ok) {
//                const data = await response.json();
//                setShippingRates(data.rates || []);
//                setError("");
//            } else {
//                const errorData = await response.json();
//                setError(errorData.error || "Failed to fetch shipping rates");
//            }
//        } catch (err) {
//            setError("An error occurred while fetching shipping rates");
//        }
//    };
//
//    const handleConfirmShipping = (selectedRate) => {
//        // Save the selected shipping rate and proceed
//        localStorage.setItem("selectedShippingRate", JSON.stringify(selectedRate));
//        navigate("/payment"); // Redirect to the payment page
//    };
//
//    return (
//        <div className="shipping-container">
//            <h2>Shipping Information</h2>
//            <div className="form-section">
//                <h3>Recipient Address</h3>
//                <input
//                    type="text"
//                    placeholder="Name"
//                    value={addressTo.name}
//                    onChange={(e) => setAddressTo({ ...addressTo, name: e.target.value })}
//                />
//                <input
//                    type="text"
//                    placeholder="Street"
//                    value={addressTo.street1}
//                    onChange={(e) => setAddressTo({ ...addressTo, street1: e.target.value })}
//                />
//                <input
//                    type="text"
//                    placeholder="City"
//                    value={addressTo.city}
//                    onChange={(e) => setAddressTo({ ...addressTo, city: e.target.value })}
//                />
//                <input
//                    type="text"
//                    placeholder="State"
//                    value={addressTo.state}
//                    onChange={(e) => setAddressTo({ ...addressTo, state: e.target.value })}
//                />
//                <input
//                    type="text"
//                    placeholder="ZIP"
//                    value={addressTo.zip}
//                    onChange={(e) => setAddressTo({ ...addressTo, zip: e.target.value })}
//                />
//            </div>
//
//            <button onClick={handleFetchRates} className="fetch-rates-button">Get Shipping Rates</button>
//
//            {error && <p className="error-message">{error}</p>}
//
//            {shippingRates.length > 0 ? (
//                <div className="rates-section">
//                    <h3>Available Shipping Rates</h3>
//                    {shippingRates.map((rate, index) => (
//                        <div key={index} className="rate-item">
//                            <p>Provider: {rate.provider}</p>
//                            <p>Service: {rate.servicelevel}</p>
//                            <p>Cost: {rate.currency} {rate.amount}</p>
//                            <p>Estimated Days: {rate.estimated_days}</p>
//                            <button onClick={() => handleConfirmShipping(rate)}>Select</button>
//                        </div>
//                    ))}
//                </div>
//            ) : (
//                <p className="no-rates-message">No shipping rates available for the provided address.</p>
//            )}
//        </div>
//    );
//};
//
//export default Shipping;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Shipping.css'; // Create a CSS file for styling

const Shipping = () => {
    const [addressTo, setAddressTo] = useState({
        name: "",
        street1: "",
        city: "",
        state: "",
        zip: "",
        country: "US",
    });

    const [shippingRates, setShippingRates] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleFetchRates = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/shipping/rates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address_to: addressTo }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.rates && data.rates.length > 0) {
                    // Assuming the response has a 'rates' field containing the shipping rates
                    setShippingRates(data.rates);
                    setError("");
                } else {
                    setError("No shipping rates available for the provided address.");
                    setShippingRates([]);
                }
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Failed to fetch shipping rates");
                setShippingRates([]);
            }
        } catch (err) {
            setError("An error occurred while fetching shipping rates");
            setShippingRates([]);
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
            </div>

            <button onClick={handleFetchRates} className="fetch-rates-button">Get Shipping Rates</button>

            {error && <p className="error-message">{error}</p>}

            {shippingRates.length > 0 ? (
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
            ) : (
                <p className="no-rates-message">No shipping rates available for the provided address.</p>
            )}
        </div>
    );
};

export default Shipping;
