/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Globe, Users, Shield, ArrowRight } from "lucide-react";

export default function Services() {
  const navigate = useNavigate();
  const [hoveredService, setHoveredService] = useState(null);

  const services = [
    {
      id: "issue-reporting",
      title: "Issue Reporting",
      description:
        "Efficiently report and address community concerns and problems through our user-friendly interface.",
      icon: <FileText className="text-green-600 mr-3" />,
      route: "/complaint",
    },
    {
      id: "community-connect",
      title: "Community Connections",
      description:
        "Build stronger neighborhood bonds through collaborative platforms and shared initiatives.",
      icon: <Users className="text-green-600 mr-3" />,
      route: "/drive",
    },
    {
      id: "local-initiatives",
      title: "Local Initiatives",
      description:
        "Participate in and track community development projects that make a real difference.",
      icon: <Globe className="text-green-600 mr-3" />,
      route: "/initiatives",
    },
    {
      id: "NGO connect",
      title: "NGO connect",
      description:
        "Connect directly with nearby NGO's and help them in their venture",
      icon: <Shield className="text-green-600 mr-3" />,
      route: "/ngo",
    },
  ];

  const handleServiceClick = (route) => {
    navigate(route);
  };

  return (
    <section
      id="services"
      className="py-16 bg-gradient-to-br from-green-50 to-green-100"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-green-800 mb-4">
            Our Services
          </h2>
          <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
            Empowering communities through innovative solutions that connect,
            protect, and inspire positive change.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="group"
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <div
                className={`
                  bg-white p-6 rounded-xl shadow-sm 
                  hover:shadow-md transition-all duration-300
                  ${hoveredService === service.id ? "scale-105 shadow-lg" : ""}
                  cursor-pointer
                `}
                onClick={() => handleServiceClick(service.route)}
              >
                <div className="flex items-center mb-4">
                  {service.icon}
                  <h3 className="text-xl font-semibold text-green-800">
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">{service.description}</p>
                <div className="flex items-center text-green-600 group-hover:text-green-800">
                  <span className="mr-2">Learn More</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
