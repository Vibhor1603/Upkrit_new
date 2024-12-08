import { useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import About from "./Components/About";
import Services from "./Components/Services";
import ComplaintForm from "./Components/ComplaintForm";
import Contact from "./Components/Contact";
import Footer from "./Components/Footer";
import MapInterface from "./MapInterface";

const App = () => {
  // Create refs for sections
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const contactRef = useRef(null);

  // State for login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="app">
        <Navbar
          isLoggedIn={isLoggedIn}
          onLogin={handleLogin}
          onLogout={handleLogout}
          aboutRef={aboutRef}
          servicesRef={servicesRef}
          contactRef={contactRef}
        />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <div ref={aboutRef}>
                  <About />
                </div>
                <div ref={servicesRef}>
                  <Services />
                </div>
                <div ref={contactRef}>
                  <Contact />
                </div>
              </>
            }
          />
          <Route path="/complaint" element={<ComplaintForm />} />
          <Route path="/drive" element={<MapInterface />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
