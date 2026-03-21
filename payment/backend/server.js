const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.post("/create-order", (req, res) => {

    const { amount } = req.body;

    console.log("Amount received:", amount);

    res.json({
        order_id: "order_test_123",
        amount: amount,
        currency: "INR"
    });
});


app.listen(5000, () => {
    console.log("Server running on port 5000");
});