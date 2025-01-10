import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

//placing user order from frontend
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5174";
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: req.body.paymentMethod === "COD" ? false : true, // Payment status
            status: req.body.paymentMethod === "COD" ? "Order Confirmed" : "Pending Payment",
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.status(200).json({
            success: true,
            message: req.body.paymentMethod === "COD"
                ? "Order confirmed! Thank you for choosing Cash on Delivery."
                : "Proceed to online payment.",
        });
    } catch (error) {
        console.error("Order placement error:", error);
        res.status(500).json({ success: false, message: "Error placing order." });
    }
};
//users order for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({
            success: false, message: "Error"
        })
    }

}
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}
//api for updating order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status updated" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }

}

export { placeOrder, userOrders, listOrders, updateStatus }