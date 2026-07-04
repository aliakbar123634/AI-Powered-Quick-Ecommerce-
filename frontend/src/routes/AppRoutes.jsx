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
import CheckOut from "../pages/CheckOut";
import OrderSuccess from "../pages/OrderSuccess";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import Wishlist from "../pages/Wishlist";
import Location from "../pages/Location";

const AppRoutes=()=>{
    return (
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/category" element={<Category/>}/>
                <Route path="/category/:id" element={<CategoryDetails/>}/>
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
                {/* <Route element={<ProtectedRoute />}>
                    <Route path="/cart" element={<Cart />} />
                </Route> */}
            </Routes>
    )
}
export default AppRoutes;