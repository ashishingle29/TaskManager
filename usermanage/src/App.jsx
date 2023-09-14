import React from 'react'
import Login from './Components/Login'
import { BrowserRouter , Route, Routes } from 'react-router-dom'
import Home from './Components/Home'


function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route axact path='/' element={<Home />} />
        <Route axact path='/login' element={<Login />} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App