import { Users, Globe, CheckCircle } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-green-50 to-green-100 min-h-screen flex items-center">
      <div className="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-sm"></div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="h-1 w-12 bg-green-600 rounded"></span>
                <span className="text-green-700 font-medium uppercase tracking-wider">
                  Community Platform
                </span>
              </div>

              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                Empower. Connect.
                <br />
                <span className="text-green-700">Transform Communities</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                A powerful platform designed to bring people together, foster
                collaboration, and create meaningful impact through local
                initiatives and shared goals.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Users className="text-green-600" size={28} />
                <span className="text-gray-700">Network Building</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="text-green-600" size={28} />
                <span className="text-gray-700">Global Reach</span>
              </div>
            </div>

            {/* Call to Action */}
            <div className="flex space-x-4">
              <a
                href="#signup"
                className="px-8 py-3 bg-green-600 text-white rounded-full 
                           hover:bg-green-700 transition-all duration-300 
                           shadow-lg hover:shadow-xl transform hover:-translate-y-1 
                           inline-flex items-center space-x-2"
              >
                <span>Get Started</span>
                <CheckCircle size={20} />
              </a>
              <a
                href="#learn-more"
                className="px-8 py-3 border-2 border-green-600 text-green-700 
                           rounded-full hover:bg-green-50 transition-all duration-300 
                           inline-flex items-center space-x-2"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative">
            <div className="bg-green-100 rounded-3xl p-6 shadow-2xl">
              <div className="relative overflow-hidden rounded-2xl transform hover:scale-105 transition-transform duration-500">
                <img
                  src="/logo.jpg"
                  alt="Community Connection"
                  className="w-full h-[500px] object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-green-900 bg-opacity-20"></div>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-10 -right-10 bg-white rounded-2xl shadow-2xl p-6 w-64">
              <div className="flex items-center space-x-4">
                <div className="text-4xl font-bold text-green-600">2K+</div>
                <div className="text-gray-600">
                  Active Community
                  <br />
                  Members
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default Hero;
