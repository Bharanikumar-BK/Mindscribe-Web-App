import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div
          className="flex flex-col gap-6 w-[400px] mx-auto p-8 
                     bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 
                     rounded-2xl shadow-2xl items-center text-center animate-fadeIn"
        >
          <h1 className="text-3xl font-bold text-white tracking-wide">
            Login Successful
          </h1>
          <p className="text-gray-200">
            Welcome back! You have successfully logged in. 
            You can now access your dashboard and explore.
          </p>
          <button
            onClick={() => {
              const username = localStorage.getItem("username");
              navigate("/dashboard", { state: { username } });
            }}
            className="w-full py-2 mt-2 bg-white text-green-700 font-semibold 
                       rounded-lg shadow-lg hover:bg-gray-200 hover:scale-105 
                       transition-transform duration-300 cursor-pointer"
          >
            Go to Dashboard
          </button>

          <p className="text-sm text-gray-300 mt-4">
            Not you? 
            <span
              className="text-white underline cursor-pointer hover:text-gray-200"
              onClick={() => navigate("/")}
            >
              Logout
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Success;