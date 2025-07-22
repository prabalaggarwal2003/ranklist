import React from 'react'
import Header from './components/Header'
import {Outlet} from 'react-router'
import Footer from './components/Footer'

function App() {
  return (
    <div className='font-poppins overflow-x-hidden'>
      <Header/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default App
