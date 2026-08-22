import React from 'react'
import { BrowserRouter } from "react-router-dom";
import AppRoutes from './routes/AppRoutes'
import ProtectedRoute from './routes/ProtectedRoute'
import AICursor from './components/AICursor';
const App = () => {
  return (
    <div>
      
       <BrowserRouter>
           {/* <AICursor /> */}
           <AppRoutes />            
      </BrowserRouter>
             
    </div>
  )
}

export default App

