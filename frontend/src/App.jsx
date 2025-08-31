import { useState } from 'react'
import './App.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const App = () => {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const navigator = useNavigate()

  const handleUser = (e) => {
    setUserName(e.target.value)
  }
  const handlePass = (e) => {
    setPassword(e.target.value)
  }

  const Check = () => {
    axios.post("http://localhost:3000/login", { username: userName, password })
      .then((res) => {
        if (res.data.success) {
          localStorage.setItem("username", res.data.user.username)
          navigator("/success", { state: { username: res.data.user.username } })

        } else {
          navigator("/fail")
        }
      })
      .catch(() => {
        navigator("/fail")
      })
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col gap-4 w-[350px] mx-auto p-8 
                        bg-gradient-to-br from-neutral-900 via-black to-neutral-800 
                        rounded-2xl shadow-2xl items-center animate-fadeIn">
          <h2 className="text-2xl font-bold text-white mb-2 tracking-wide text-center">
            Welcome Back 👋
          </h2>
          <p className="text-sm text-gray-400 mb-4 text-center">Login to continue</p>

          <input 
            type="text" 
            placeholder="Username" 
            onChange={handleUser} 
            name="username" 
            className="w-full px-4 py-2 border border-gray-600 
                       bg-white/10 backdrop-blur-md text-white 
                       placeholder-gray-400 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-white 
                       transition-all duration-300"
          />

          <input 
            type="password" 
            placeholder="Password" 
            onChange={handlePass} 
            name="password" 
            className="w-full px-4 py-2 border border-gray-600 
                       bg-white/10 backdrop-blur-md text-white 
                       placeholder-gray-400 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-white 
                       transition-all duration-300"
          />

          <button
            onClick={Check}
            type="submit"
            className="w-full py-2 mt-4 bg-white text-black font-semibold 
                       rounded-lg shadow-lg hover:bg-gray-200 hover:scale-105 
                       transition-transform duration-300 cursor-pointer"
          >
            Login
          </button>

          <p 
            onClick={() => navigator("/signup")}
            className="text-xs text-gray-400 mt-4 hover:text-white 
                       cursor-pointer transition-colors duration-300">
            Don’t have an account? Sign up
          </p>

          <p className="text-xs text-gray-400 mt-4 hover:text-white 
                       cursor-pointer transition-colors duration-300">
            Forgot password?
          </p>
        </div>
      </div>
    </>
  )
}

export default App
