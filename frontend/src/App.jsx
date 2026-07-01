import React from 'react'
import { BrowserRouter } from "react-router-dom";
import AppRoutes from './routes/AppRoutes'
import ProtectedRoute from './routes/ProtectedRoute'
const App = () => {
  return (
    <div>
       <BrowserRouter>
           <AppRoutes />            
      </BrowserRouter>
             
    </div>
  )
}

export default App

