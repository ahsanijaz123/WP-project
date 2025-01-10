import  { useContext, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
const url = "http://localhost:4000";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems } =
    useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    zipcode: "",
    country: "",
    phone: "",
    paymentMethod: "COD", // Default to COD
  });
  const [orderConfirmed, setOrderConfirmed] = useState(false); // State for order confirmation

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });
  
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
      paymentMethod: data.paymentMethod,
    };
  
    try {
      const response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      });
  
      if (response.data.success) {
        setOrderConfirmed(true);
      } else {
        alert("Error: " + (response.data.message || "Unknown error occurred."));
      }
    } catch (error) {
      console.error("API Error:", error.response || error.message);
      alert(
        "Failed to place order. Please try again later. Error: " +
          (error.response?.data?.message || error.message)
      );
    }
  };
  
  return (
    <div className="place-order-container">
      {orderConfirmed ? (
        <div className="order-confirmation">
          <h2>Order Confirmed</h2>
          <p>
            Thank you for your order! It is being processed and will be
            delivered shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={placeOrder} className="place-order">
          <div className="place-order-left">
            <p className="title">Delivery Information</p>
            <div className="multi-fields">
              <input
                required
                name="firstName"
                onChange={onChangeHandler}
                value={data.firstName}
                type="text"
                placeholder="First Name"
              />
              <input
                required
                name="lastName"
                onChange={onChangeHandler}
                value={data.lastName}
                type="text"
                placeholder="Last Name"
              />
            </div>
            <input
              required
              name="email"
              onChange={onChangeHandler}
              value={data.email}
              type="email"
              placeholder="Email address"
            />
            <input
              required
              name="street"
              onChange={onChangeHandler}
              value={data.street}
              type="text"
              placeholder="Street"
            />
            <div className="multi-fields">
              <input
                name="city"
                onChange={onChangeHandler}
                value={data.city}
                type="text"
                placeholder="City"
              />
              <input
                name="state"
                onChange={onChangeHandler}
                value={data.state}
                type="text"
                placeholder="State"
              />
            </div>
            <div className="multi-fields">
              <input
                required
                name="zipcode"
                onChange={onChangeHandler}
                value={data.zipcode}
                type="text"
                placeholder="Zip code"
              />
              <input
                required
                name="country"
                onChange={onChangeHandler}
                value={data.country}
                type="text"
                placeholder="Country"
              />
            </div>
            <input
              name="phone"
              onChange={onChangeHandler}
              value={data.phone}
              type="text"
              placeholder="Phone"
            />
            <select
              name="paymentMethod"
              value={data.paymentMethod}
              onChange={onChangeHandler}
              required
            >
              <option value="COD">Cash on Delivery</option>
            </select>
          </div>
          <div className="place-order-right">
            <div className="cart-total">
              <h2>Cart Totals</h2>
              <div>
                <div className="cart-total-details">
                  <p>Subtotal</p>
                  <p>RS {getTotalCartAmount()}</p>
                </div>
                <hr />
                <div className="cart-total-details">
                  <p>Delivery Fee</p>
                  <p>{200}</p>
                </div>
                <hr />
                <div className="cart-total-details">
                  <b>Total</b>
                  <b>RS {getTotalCartAmount() + 200}</b>
                </div>
              </div>
              <button type="submit">Confirm Order</button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default PlaceOrder;
