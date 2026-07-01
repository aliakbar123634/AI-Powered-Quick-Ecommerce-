import React from "react";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
const CartSummary = ({ cart, onCheckout }) => {
  if (!cart) return null;

  const subtotal = Number(cart.total_price || 0);
  const shipping = 0;
  const discount = 0;
  const tax = 0;

  const total = subtotal + shipping + tax - discount;

  return (
    <div className="lg:col-span-4">

      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 sticky top-24">

        <h2 className="text-2xl font-bold mb-6">
          Order Summary
        </h2>

        <div className="space-y-4">

          <div className="flex justify-between text-gray-600">
            <span>Items</span>
            <span>{cart.total_items}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span className="text-green-600 font-medium">
              Free
            </span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Discount</span>
            <span>${discount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <hr />

          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

        </div>
       

        <Link to='/checkout'
          onClick={onCheckout}
          className="
            mt-8
            w-full
            bg-green-600
            hover:bg-green-700
            text-white
            py-4
            rounded-2xl
            font-semibold
            flex
            items-center
            justify-center
            gap-2
            transition-all
          "
        >
        <ShoppingBag size={20} />
          Proceed To Checkout
        </Link>


      </div>

    </div>
  );
};

export default CartSummary;