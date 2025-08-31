import { useNavigate } from "react-router-dom";

const Failure = () => {
    const navigate = useNavigate();
    return (
        <div className="flex items-center justify-center h-screen bg-black">
            <div className="bg-white text-center rounded-2xl shadow-lg p-10 w-96">
                <h1 className="text-3xl font-bold text-red-600 mb-4">
                    Login Failed
                </h1>
                <p className="text-gray-700 mb-6">
                    Oops! Something went wrong. Please try again with the correct credentials.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition duration-300"
                >
                    Retry Login
                </button>
            </div>
        </div>
    );
};

export default Failure;