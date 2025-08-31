import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Failure from './Failure.jsx'
import Success from './Success.jsx'
import Signup from "./Signup";
import Dashboard from "./Dashboard.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>}></Route>
        <Route path="/signup" element={<Signup />} />
      <Route path='/success' element={<Success/>}></Route>
      <Route path='/fail' element={<Failure/>}></Route>
        <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
