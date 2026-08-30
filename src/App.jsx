import './App.css'
import Signup from './user/Signup'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Navbar from './user/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Navbar />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App