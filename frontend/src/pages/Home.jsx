import React from 'react'
import {logoutUser} from '../api/authApi'
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection"
import StatsBar from "../components/StatsBar";
import TrustBadges from "../components/TrustBadges";
import CategoryCard from '../components/CategoryCard';
import FeaturedProducts from "../components/FeaturedProducts"
import AIRecommendation from "../components/AIRecommendation"
import FeaturesSection from '../components/FeaturesSection';
import HowItWorks from '../components/HowItWorks'
import TestimonialsSection from '../components/TestimonialsSection'
import CTASection from '../components/CTASection'


const Home = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout=async()=>{
      logout();
      navigate("/login");
      navigate("/login");
  }
          const auth = useAuthStore();
           console.log(auth);
  return (
    <>
    <Navbar />
    <HeroSection/>
    <StatsBar/>
    <TrustBadges/>
    <CategoryCard/>
    <FeaturedProducts/>
    <AIRecommendation/>
    <FeaturesSection/>
    <HowItWorks />
    <TestimonialsSection />
    <CTASection/>
    <div>
      Home ho ma mujha sab ata ha 
      <button onClick={handleLogout}>Logout</button>
      
    </div>
    </>
  )
}

export default Home


