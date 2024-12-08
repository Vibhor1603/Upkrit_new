/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import { Navigate, useNavigate } from "react-router-dom";

const Navbar = ({ servicesRef, aboutRef, contactRef }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setIsLoginModalOpen(false);
  };

  const handleSignup = (userData) => {
    setIsSignupModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        localStorage.clear();
        navigate("/"); // Redirect to home page
      } else {
        console.error("logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Smooth scroll function
  const scrollToSection = (elementRef) => {
    elementRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem("username");
  function handleHome() {
    navigate("/");
  }

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-green-800 text-white shadow-md z-50">
        <div className="container mx-auto px-1 py-2 flex justify-between items-center max-w-6xl">
          {/* Logo Section */}
          <div className="flex items-center" onClick={handleHome}>
            <img
              src="/logo.jpg"
              alt="Upkrit Logo"
              className="h-10 w-10 rounded-full object-cover mr-3"
            />
            <span className="text-xl font-bold">Upkrit</span>
          </div>

          {/* Navigation and User Section */}
          <div className="flex items-center space-x-4">
            {/* Always Visible Options */}
            {/* <button
              onClick={() => scrollToSection(servicesRef)}
              className="hover:text-green-200 transition-colors text-sm"
            >
              Services
            </button> */}

            {/* Conditionally Rendered Options */}
            {isLoggedIn ? (
              <>
                {/* Logged-in User Options */}
                {/* <button
                  onClick={() => scrollToSection(aboutRef)}
                  className="hover:text-green-200 transition-colors text-sm"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection(contactRef)}
                  className="hover:text-green-200 transition-colors text-sm"
                >
                  Contact
                </button> */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => (window.location.href = "/profile")}
                    className="hover:text-green-200 transition-colors text-sm"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => (window.location.href = "/complaint")}
                    className="hover:text-green-200 transition-colors text-sm"
                  >
                    Create Complaint
                  </button>
                  <button
                    onClick={() => (window.location.href = "/drive")}
                    className="hover:text-green-200 transition-colors text-sm"
                  >
                    Engage
                  </button>
                  <span className="text-sm">
                    Welcome, {localStorage.getItem("username") || "User"}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg text-sm transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Guest User Options */}
                <button
                  onClick={() => scrollToSection(aboutRef)}
                  className="hover:text-green-200 transition-colors text-sm"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection(contactRef)}
                  className="hover:text-green-200 transition-colors text-sm"
                >
                  Contact
                </button>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="bg-white text-green-800 hover:bg-green-100 px-3 py-1.5 rounded-lg text-sm transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setIsSignupModalOpen(true)}
                    className="bg-green-600 text-white hover:bg-green-700 px-3 py-1.5 rounded-lg text-sm transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Login and Signup Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSignup={handleSignup}
      />
    </>
  );
};

export default Navbar;
