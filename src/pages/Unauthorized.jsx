import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600">403</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-800">
        Access Denied 🚫
      </h2>
      <p className="mt-2 text-gray-600">
        You don't have permission to access this page.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default Unauthorized;