import './App.css'
import Signup from './user/Signup'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Navbar from './user/Navbar'

function App() {

  return (
  <>
   <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
       <Route path="*" element={<Navbar />} />
        </Routes>
        </Router>
        </>
  )
}

export default App
