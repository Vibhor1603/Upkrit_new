import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  User,
  LogOut,
  Bell,
  ChevronDown,
  Home,
  FileText,
  Users,
  Activity,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

const Navbar = ({ servicesRef, aboutRef, contactRef }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem("username");
  const username = localStorage.getItem("username") || "User";

  // Handle scroll events to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Smooth scroll function
  const scrollToSection = (elementRef) => {
    setIsMobileMenuOpen(false);
    elementRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Navigation handler
  const navigateTo = (path) => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    navigate(path);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md text-green-800 shadow-md py-2"
            : "bg-gradient-to-r from-green-800 to-green-700 text-white py-3"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center max-w-6xl">
          {/* Logo Section - Improved positioning and styling */}
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => navigateTo("/")}
          >
            <div
              className={`relative transition-all duration-500 ${
                isScrolled ? "h-10 w-10" : "h-12 w-12"
              }`}
            >
              <div className="absolute inset-0 bg-white rounded-xl shadow-lg transform -rotate-6 opacity-80"></div>
              <div
                className={`absolute inset-0 overflow-hidden rounded-xl ${
                  isScrolled ? "transform rotate-0" : "transform rotate-3"
                } transition-transform duration-500`}
              >
                <img
                  src="/logo.jpg"
                  alt="Upkrit Logo"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="ml-3 flex flex-col">
              <span
                className={`font-display font-bold transition-all duration-300 ${
                  isScrolled ? "text-green-700 text-lg" : "text-white text-xl"
                }`}
              >
                Upkrit
              </span>
              <span
                className={`text-xs transition-all duration-300 ${
                  isScrolled ? "text-green-500" : "text-green-100"
                }`}
              >
                Community Drives
              </span>
            </div>
          </div>

          {/* Desktop Navigation - Improved spacing and styling */}
          <div className="hidden md:flex items-center space-x-1">
            {isLoggedIn ? (
              <>
                {/* Main nav items with updated styling */}
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-1.5 py-1.5 flex items-center mr-2">
                  <NavItem
                    icon={<Home size={16} />}
                    text="Home"
                    onClick={() => navigateTo("/")}
                    isScrolled={isScrolled}
                    isActive={location.pathname === "/"}
                  />
                  <NavItem
                    icon={<FileText size={16} />}
                    text="Complaints"
                    onClick={() => navigateTo("/complaint")}
                    isScrolled={isScrolled}
                    isActive={location.pathname === "/complaint"}
                  />
                  <NavItem
                    icon={<Users size={16} />}
                    text="Engage"
                    onClick={() => navigateTo("/drive")}
                    isScrolled={isScrolled}
                    isActive={location.pathname === "/drive"}
                  />
                  <NavItem
                    icon={<Activity size={16} />}
                    text="Active"
                    onClick={() => navigateTo("/active-drives")}
                    isScrolled={isScrolled}
                    isActive={location.pathname === "/active-drives"}
                  />
                </div>

                {/* Notification icon */}
                <button
                  className={`relative p-2 rounded-full ${
                    isScrolled ? "hover:bg-green-100" : "hover:bg-white/10"
                  } transition-colors duration-200 mr-1`}
                >
                  <Bell size={18} />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile dropdown with improved styling */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
                      isScrolled
                        ? "bg-green-50 hover:bg-green-100 text-green-800"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center ${
                        isScrolled
                          ? "bg-green-200 text-green-700"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      <User size={14} />
                    </div>
                    <span className="text-sm font-medium">{username}</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        isProfileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl py-1 z-50 animate-fade-in border border-gray-100 overflow-hidden">
                      <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-green-100">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-green-200 flex items-center justify-center text-green-700">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="font-medium text-green-800 text-sm">
                              {username}
                            </p>
                            <p className="text-xs text-green-600">
                              user@example.com
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => navigateTo("/profile")}
                          className="flex items-center w-full text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-green-50 justify-between group"
                        >
                          <div className="flex items-center">
                            <span className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mr-3">
                              <User size={16} />
                            </span>
                            <span>My Profile</span>
                          </div>
                          <ChevronRight
                            size={14}
                            className="text-gray-400 group-hover:text-green-600 transition-colors"
                          />
                        </button>

                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 mt-1 justify-between group"
                        >
                          <div className="flex items-center">
                            <span className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 mr-3">
                              <LogOut size={16} />
                            </span>
                            <span>Logout</span>
                          </div>
                          <ChevronRight
                            size={14}
                            className="text-gray-400 group-hover:text-red-600 transition-colors"
                          />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Guest Options with improved styling */}
                <div className="flex items-center space-x-2 mr-4">
                  <button
                    onClick={() => scrollToSection(aboutRef)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isScrolled
                        ? "hover:bg-green-100 text-green-800"
                        : "hover:bg-white/10 text-white"
                    }`}
                  >
                    About
                  </button>
                  <button
                    onClick={() => scrollToSection(contactRef)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isScrolled
                        ? "hover:bg-green-100 text-green-800"
                        : "hover:bg-white/10 text-white"
                    }`}
                  >
                    Contact
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      isScrolled
                        ? "bg-green-100 text-green-700 hover:bg-green-200 hover:shadow-md"
                        : "bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setIsSignupModalOpen(true)}
                    className="bg-gradient-to-r from-green-600 to-green-500 text-white hover:shadow-lg px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-md transform hover:-translate-y-0.5"
                  >
                    Sign Up
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button - Improved styling */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-full ${
              isScrolled
                ? "hover:bg-green-100 text-green-700"
                : "hover:bg-white/10 text-white"
            } focus:outline-none transition-colors`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu - Improved styling */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg overflow-hidden animate-slide-down border-t border-gray-100">
            <div className="px-6 py-4 space-y-1">
              {isLoggedIn ? (
                <>
                  {/* User info */}
                  <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center text-green-700 mr-4 shadow-md">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-green-800 text-lg">
                        {username}
                      </p>
                      <p className="text-sm text-green-600">user@example.com</p>
                    </div>
                  </div>

                  <MobileNavItem
                    text="Home"
                    icon={<Home size={18} />}
                    onClick={() => navigateTo("/")}
                    isActive={location.pathname === "/"}
                  />
                  <MobileNavItem
                    text="My Profile"
                    icon={<User size={18} />}
                    onClick={() => navigateTo("/profile")}
                    isActive={location.pathname === "/profile"}
                  />
                  <MobileNavItem
                    text="Create Complaint"
                    icon={<FileText size={18} />}
                    onClick={() => navigateTo("/complaint")}
                    isActive={location.pathname === "/complaint"}
                  />
                  <MobileNavItem
                    text="Engage in Drives"
                    icon={<Users size={18} />}
                    onClick={() => navigateTo("/drive")}
                    isActive={location.pathname === "/drive"}
                  />
                  <MobileNavItem
                    text="Active Drives"
                    icon={<Activity size={18} />}
                    onClick={() => navigateTo("/active-drives")}
                    isActive={location.pathname === "/active-drives"}
                  />

                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center justify-between px-4 py-3 text-red-600 rounded-xl hover:bg-red-50 group"
                    >
                      <div className="flex items-center">
                        <span className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 mr-3">
                          <LogOut size={18} />
                        </span>
                        <span>Logout</span>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-gray-400 group-hover:text-red-600 transition-colors"
                      />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => scrollToSection(aboutRef)}
                    className="flex w-full items-center px-4 py-3 text-green-800 rounded-xl hover:bg-green-50 mb-1"
                  >
                    About
                  </button>
                  <button
                    onClick={() => scrollToSection(contactRef)}
                    className="flex w-full items-center px-4 py-3 text-green-800 rounded-xl hover:bg-green-50"
                  >
                    Contact
                  </button>

                  <div className="grid grid-cols-2 gap-4 pt-4 mt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsLoginModalOpen(true);
                      }}
                      className="px-4 py-3 bg-green-100 text-green-700 rounded-xl text-sm font-medium hover:bg-green-200 transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsSignupModalOpen(true);
                      }}
                      className="px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl text-sm font-medium hover:shadow-md transition-all"
                    >
                      Sign Up
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Modal Components */}
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

// Desktop Navigation Item component - Completely redesigned
const NavItem = ({ icon, text, onClick, isScrolled, isActive }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${
      isActive
        ? isScrolled
          ? "bg-green-700 text-white shadow-md"
          : "bg-white text-green-800 shadow-md"
        : isScrolled
        ? "hover:bg-green-100 text-green-800"
        : "hover:bg-white/20 text-white"
    }`}
  >
    <span className={`${isActive ? "" : "opacity-70"}`}>{icon}</span>
    <span className="text-xs font-medium">{text}</span>
  </button>
);

// Mobile Navigation Item component - Completely redesigned
const MobileNavItem = ({ icon, text, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-green-100 text-green-700 font-medium"
        : "text-gray-700 hover:bg-gray-50"
    } group`}
  >
    <div className="flex items-center">
      <span
        className={`h-8 w-8 rounded-lg ${
          isActive ? "bg-green-200" : "bg-gray-100"
        } flex items-center justify-center ${
          isActive ? "text-green-600" : "text-gray-500"
        } mr-3`}
      >
        {icon}
      </span>
      <span>{text}</span>
    </div>
    <ChevronRight
      size={16}
      className={`${
        isActive ? "text-green-500" : "text-gray-400 group-hover:text-gray-500"
      } transition-colors`}
    />
  </button>
);

export default Navbar;
