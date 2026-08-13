import React, { useEffect, useState } from "react";
import { dealProducts } from "../api/productApi";
import Navbar from "../components/Navbar";
import Footer from "../components/footer/Footer";
import DealsHero from "../components/Deals/DealsHero";
import DealsCountdown from "../components/deals/DealsCountdown";
import FeaturedDeals from "../components/deals/FeaturedDeals";
import TopRatedDeals from "../components/deals/TopRatedDeals";
import BottomOfferBanner from "../components/deals/BottomOfferBanner";
const Deals = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeals();
    }, []);

    const fetchDeals = async () => {
        try {
            const data = await dealProducts();

            console.log("Deals API:", data);

            // Agar pagination hai
            if (data.results) {
                setProducts(data.results);
            }
            // Agar direct array return hota hai
            else {
                setProducts(data);
            }

        } catch (error) {
            console.error("Deals API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <h2 className="text-center mt-10">Loading...</h2>;
    }

    return (

        <>
            <Navbar/>
            <div className="max-w-7xl mx-auto px-6 py-10">
                <DealsHero />
                <DealsCountdown/>
                <FeaturedDeals />
                <TopRatedDeals />
                <BottomOfferBanner/>
            </div>
            <Footer/>
        </>
    );
};

export default Deals;