import React, { useState } from "react";

const PaymentMethod = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">

      <h2 className="text-2xl font-bold mb-6">
        Payment Method
      </h2>

      <div className="space-y-4">

        {/* Cash On Delivery */}

        <label className="flex items-center justify-between border rounded-2xl p-5 cursor-pointer hover:border-green-500 transition">

          <div className="flex items-center gap-4">

            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
            />

            <div>
              <h3 className="font-semibold">
                Cash On Delivery
              </h3>

              <p className="text-gray-500 text-sm">
                Pay when your order arrives.
              </p>
            </div>

          </div>

        </label>

        {/* Credit Card */}

        <label className="flex items-center justify-between border rounded-2xl p-5 cursor-pointer hover:border-green-500 transition">

          <div className="flex items-center gap-4">

            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
            />

            <div>
              <h3 className="font-semibold">
                Credit / Debit Card
              </h3>

              <p className="text-gray-500 text-sm">
                Visa, Mastercard, American Express
              </p>
            </div>

          </div>

        </label>

        {/* JazzCash */}

        <label className="flex items-center justify-between border rounded-2xl p-5 cursor-pointer hover:border-green-500 transition">

          <div className="flex items-center gap-4">

            <input
              type="radio"
              name="payment"
              value="jazzcash"
              checked={paymentMethod === "jazzcash"}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
            />

            <div>
              <h3 className="font-semibold">
                JazzCash / EasyPaisa
              </h3>

              <p className="text-gray-500 text-sm">
                Mobile Wallet Payment
              </p>
            </div>

          </div>

        </label>

      </div>

    </div>
  );
};

export default PaymentMethod;