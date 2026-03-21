document.addEventListener("DOMContentLoaded", function() {

    const payButton = document.querySelector(".pay-btn");

    payButton.addEventListener("click", async function() {

        const amountInput = document.querySelector("input");
        const amount = amountInput.value;

        if (amount <= 0 || amount === "") {
            alert("Please enter valid amount");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ amount: amount })
            });

            const data = await response.json();

            alert("Order Created: " + data.order_id);

        } catch (error) {
            console.error("Error:", error);
            alert("Backend not reachable");
        }

    });

});

        document.querySelector(".pay-btn").addEventListener("click", function() {

            const amount = document.querySelector("input").value;

            if(amount <= 0 || amount === "") {
                alert("Please enter valid amount");
                return;
            }

            alert("Proceeding to payment of ₹" + amount);

        });
