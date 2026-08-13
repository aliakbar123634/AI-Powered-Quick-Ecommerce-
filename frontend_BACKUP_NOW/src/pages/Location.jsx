import React from 'react'
import MapView from '../components/map/MapView'
import Navbar from '../components/Navbar'
const Location = () => {
  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-10">

        <h1 className="text-4xl font-bold mb-8">
          OpenStreetMap Demo
        </h1>

        <MapView />

      </div>
    </>
  )
}

export default Location