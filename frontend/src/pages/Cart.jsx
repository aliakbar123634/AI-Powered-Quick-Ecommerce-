import React, { useEffect, useState } from "react";
import { allCart,  getOrders} from "../api/orderApi";
import {updateCartItem , removeCartItem , createOrder} from "../api/orderApi"
import Navbar from "../components/Navbar";
import CartBreadcrumb from "../components/CartBreadcrumb";
import CartItems from "../components/CartItems";
import CartSummary from "../components/CartSummary";
import CartActions from "../components/CartActions";
import Footer from "../components/footer/Footer";

const Cart = () => {
  const [cart, setCart] = useState(null); // ❗ CHANGED (array → null)
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
const handleClearCart = () => {
  alert("Clear Cart API Coming Soon");
};
const fetchCart = async () => {
  try {
    const data = await allCart();

    setCart(data.data.results[0]);
  } catch (error) {
  }
};

useEffect(() => {
  const loadCart = async () => {
    await fetchCart();
    setLoading(false);
  };

  loadCart();
}, []);  

const handleIncreaseQuantity = async (productId, currentQty) => {
  try {
    await updateCartItem({
      product: productId,
      quantity: currentQty + 1,
    });

    await fetchCart();
  } catch (error) {
  }
};  

  const handleDecreaseQuantity = async (productId, currentQty) => {
  try {
    if (currentQty <= 1) return;

    await updateCartItem({
      product: productId,
      quantity: currentQty - 1,
    });

    await fetchCart();
  } catch (error) {
  }
};

  const DeleteItemFromCart = async (productId) => {
  try {
    await removeCartItem({
      product: productId,
    });

    await fetchCart();
  } catch (error) {
  }
};
const handleCreateOrder = async () => {
  try {
    const response = await createOrder();


    setOrder(response.data);

    alert("Order Created");
  } catch (error) {
  }
};
  if (loading) return <h3>Loading...</h3>;

  if (!cart) return <h3>No Cart Found</h3>;

  return (
    <div>
      <Navbar />
      <CartBreadcrumb />
      <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid lg:grid-cols-12 gap-10">

        <CartItems
            items={cart.items}
            onIncrease={handleIncreaseQuantity}
            onDecrease={handleDecreaseQuantity}
            onDelete={DeleteItemFromCart}
        />
        <CartSummary
            cart={cart}
            onCheckout={handleCreateOrder}
        />
        </div>
        </div>
        <CartActions onClearCart={handleClearCart}/>
        <Footer/>
     </div> 
  );
};

export default Cart;