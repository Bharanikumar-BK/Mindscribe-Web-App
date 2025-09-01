import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const navigator = useNavigate()

  const handleSignup = () => {
   axios.post("http://localhost:3000/signup", { username: userName, password })

      .then((res) => {
        if (res.data.success) {
          alert("Signup Successful, Please Login!")
          navigator("/")
        } else {
          alert(`Signup Failed (${res.data.message})`)
        }
      })
      .catch(() => {
        alert("Something went wrong")
      })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex flex-col gap-4 w-[350px] mx-auto p-8 
                      bg-gradient-to-br from-neutral-900 via-black to-neutral-800 
                      rounded-2xl shadow-2xl items-center animate-fadeIn">
        
        <h2 className="text-2xl font-bold text-white mb-2 tracking-wide text-center">
          Create Account
        </h2>
        <p className="text-sm text-gray-400 mb-4 text-center">Sign up to get started</p>

        <input 
          type="text" 
          placeholder="Username" 
          onChange={(e) => setUserName(e.target.value)} 
          className="w-full px-4 py-2 border border-gray-600 
                     bg-white/10 backdrop-blur-md text-white 
                     placeholder-gray-400 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-white 
                     transition-all duration-300"
        />

        <input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full px-4 py-2 border border-gray-600 
                     bg-white/10 backdrop-blur-md text-white 
                     placeholder-gray-400 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-white 
                     transition-all duration-300"
        />

        <button
          onClick={handleSignup}
          className="w-full py-2 mt-4 bg-white text-black font-semibold 
                     rounded-lg shadow-lg hover:bg-gray-200 hover:scale-105 
                     transition-transform duration-300 cursor-pointer"
        >
          Sign Up
        </button>

        <p 
          onClick={() => navigator("/")}
          className="text-xs text-gray-400 mt-4 hover:text-white 
                     cursor-pointer transition-colors duration-300">
          Already have an account? Login
        </p>
      </div>
    </div>
  )
}

export default Signup