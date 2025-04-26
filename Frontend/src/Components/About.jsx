import { useState } from "react";
import { Users, Globe, CheckCircle, Calendar, ArrowRight } from "lucide-react";

const About = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const features = [
    {
      icon: <Users className="text-green-600" size={24} />,
      title: "Connect",
      text: "Build meaningful relationships with your neighbors",
    },
    {
      icon: <Globe className="text-green-600" size={24} />,
      title: "Participate",
      text: "Join and contribute to local community initiatives",
    },
    {
      icon: <CheckCircle className="text-green-600" size={24} />,
      title: "Develop",
      text: "Help shape sustainable community development projects",
    },
    {
      icon: <Calendar className="text-green-600" size={24} />,
      title: "Stay Informed",
      text: "Never miss important local events and announcements",
    },
  ];

  return (
    <section
      id="about"
      className="py-24 bg-gradient-to-br from-green-50 via-green-100/50 to-green-50 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-green-200 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-300 rounded-full blur-3xl opacity-20 translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8 md:w-1/2">
            <div className="space-y-2">
              <div className="flex items-center space-x-3 mb-2">
                <span className="h-1 w-16 bg-green-600 rounded"></span>
                <span className="text-green-700 font-medium uppercase tracking-wider text-sm">
                  Our Mission
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                About <span className="text-green-700">Upkrit</span>
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed mt-6">
                Upkrit is a comprehensive community platform designed to empower
                neighborhoods, strengthen connections, and foster positive
                change. Our innovative system addresses key challenges faced by
                urban communities, promoting collaboration, engagement, and
                sustainable development.
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-green-100 group"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-green-50 rounded-lg text-green-600 group-hover:bg-green-100 transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-green-800">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 pl-12">{feature.text}</p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <a
                href="#learn-more"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
              >
                <span>Learn more about what we do</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </div>

          {/* Image Section */}
          <div className="md:w-1/2 relative">
            <div className="absolute inset-0 bg-green-400/10 rounded-3xl blur-xl transform transition-all duration-500 group-hover:scale-105 group-hover:blur-lg"></div>

            <div className="relative z-10 rounded-3xl overflow-hidden p-3 bg-gradient-to-br from-white/80 to-green-100/80 backdrop-blur-sm shadow-2xl group">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src="/banner.jpg"
                  alt="About Upkrit"
                  className="w-full h-[500px] object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Stats Card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 w-64 transform transition-transform duration-300 hover:scale-105">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                    2K+
                  </div>
                  <div className="text-gray-700 font-medium">
                    Active Community
                    <br />
                    Members
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
