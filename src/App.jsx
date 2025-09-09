import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './components/Login'
import OtpVerification from './components/OtpVerification'
import PassportUpload from './components/PassportUpload'
import Header from './components/Header'

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/verify-otp" element={<OtpVerification />} />
          <Route path="/upload-passport" element={<PassportUpload />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
