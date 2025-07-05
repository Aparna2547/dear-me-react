import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Signup from './user/Signup'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Login from './user/Login'
import Navbar from './user/Navbar'
import DailyRoutine from './user/DailyRoutine'
import MoneyManager from './user/MoneyManager'
import DailyRoutinePlan from './admin/DailyRoutinePlan'

function App() {

  return (
  <>
   <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
       <Route path="*" element={<Navbar />} />
        </Routes>
        </Router>
        </>
  )
}

export default App
