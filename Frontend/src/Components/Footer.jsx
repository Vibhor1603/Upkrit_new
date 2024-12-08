/* eslint-disable no-unused-vars */
import React from "react";
import { Home, Info, Layers, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      icon: <Home className="w-5 h-5 mr-2" />,
      text: "Home",
      href: "#",
    },
    {
      icon: <Info className="w-5 h-5 mr-2" />,
      text: "About",
      href: "#about",
    },
    {
      icon: <Layers className="w-5 h-5 mr-2" />,
      text: "Services",
      href: "#services",
    },
    {
      icon: <Mail className="w-5 h-5 mr-2" />,
      text: "Contact",
      href: "#contact",
    },
  ];

  return (
    <footer className="bg-gradient-to-r from-green-700 to-green-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Copyright */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start">
              <img
                src="/logo.jpg"
                alt="Upkrit Logo"
                className="h-10 mr-4 mb-2"
              />
              <h3 className="text-2xl font-bold">Upkrit</h3>
            </div>
            <p className="text-green-100 mt-4 max-w-md mx-auto md:mx-0">
              Empowering communities through innovative technology and
              collaborative solutions.
            </p>
            <div className="mt-4 text-green-200">
              &copy; {currentYear} Upkrit. All Rights Reserved
            </div>
          </div>

          {/* Right Side - Navigation Links */}
          <div className="text-center md:text-right">
            <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
            <nav className="space-y-4">
              {footerLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="flex items-center justify-center md:justify-end 
                    text-green-100 hover:text-white 
                    transition duration-300 
                    transform hover:translate-x-2"
                >
                  {link.icon}
                  {link.text}
                </a>
              ))}
            </nav>

            {/* Social Media Icons */}
            <div className="flex justify-center md:justify-end mt-8 space-x-4">
              {["Facebook", "Twitter", "LinkedIn", "Instagram"].map(
                (platform, index) => (
                  <a
                    key={platform}
                    href="#"
                    className="text-green-100 hover:text-white transition duration-300"
                  >
                    <span className="sr-only">{platform}</span>
                    {/* You can replace these with actual social media icons */}
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      {platform.charAt(0)}
                    </div>
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-green-600 mt-8 pt-4 text-center text-green-200 text-sm">
          Committed to building stronger, more connected communities
        </div>
      </div>
    </footer>
  );
};

export default Footer;
