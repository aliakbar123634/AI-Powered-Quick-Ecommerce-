import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Cart from '../pages/Cart'
import Category from '../pages/Category'
import Products from '../pages/Products'
import ProtectedRoute from "./ProtectedRoute";
import ProductDetail from "../pages/ProductDetail";
import Orders from "../pages/Orders";
import OrderDetail from "../pages/OrderDetail";
import CategoryDetails from "../pages/CategoryDetails";
// import CategoryDetail from "../pages/CategoryDetail";
import CheckOut from "../pages/CheckOut";
import OrderSuccess from "../pages/OrderSuccess";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import Wishlist from "../pages/Wishlist";
import Location from "../pages/Location";
import Payment from "../pages/Payment";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentFailed from "../pages/PaymentFailed";
import RiderDashboard from "../pages/RiderDashboard";
import ResetPassword from "../pages/ResetPassword";
import ForgotPassword from "../pages/ForgotPassword";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Terms from "../pages/Terms";
import ShippingPolicy from "../pages/ShippingPolicy";
import RefundPolicy from "../pages/RefundPolicy";
import ContactUs from "../pages/ContactUs";
import FAQ from "../pages/FAQ";
import Deals from "../pages/Deals";
import AIChat from "../pages/AIChat";


const AppRoutes=()=>{
    return (
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/category" element={<Category/>}/>
                <Route  path="/category/:slug" element={<CategoryDetails />}/>
                <Route path="/products" element={<Products/>}/>
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/orders" element={<Orders/>}/>
                <Route path="/orders/:id" element={<OrderDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<CheckOut />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/location" element={<Location />} />
                <Route path="/payment" element={<Payment/>} />
                <Route path="/payment-success" element={<PaymentSuccess />}/>
                <Route path="/payment-failed" element={<PaymentFailed />}/>
                <Route path="/rider" element={<RiderDashboard />}/>
                <Route path="/reset-password/:uid/:token" element={<ResetPassword />}/>
                <Route path="/forgot-password" element={<ForgotPassword />}/>
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/deals" element={<Deals/>}/>
                <Route path="/ai-chat" element={<AIChat />} />


                {/* <Route path="/delivary-tracking" element={<DeliveryTracking/>}/> */}

                {/* <Route element={<ProtectedRoute />}>
                    <Route path="/cart" element={<Cart />} />
                </Route> */}
            </Routes>
    )
}
export default AppRoutes;