import { Users, Globe, CheckCircle, Calendar } from "lucide-react";

export default function About() {
  return (
    <section
      id="about"
      className="py-16 bg-gradient-to-br from-green-50 to-green-100"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-green-800 mb-4">
              About Upkrit
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Upkrit is a comprehensive community management platform designed
              to empower communities, strengthen connections, and foster
              positive change. Our innovative system addresses key challenges
              faced by urban communities, promoting collaboration, engagement,
              and sustainable development.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {[
                {
                  icon: <Users className="text-green-600 mr-3" />,
                  text: "Connect with your neighbors",
                },
                {
                  icon: <Globe className="text-green-600 mr-3" />,
                  text: "Participate in local initiatives",
                },
                {
                  icon: <CheckCircle className="text-green-600 mr-3" />,
                  text: "Contribute to community development",
                },
                {
                  icon: <Calendar className="text-green-600 mr-3" />,
                  text: "Stay informed about local events",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {item.icon}
                  <span className="text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image Section */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-green-400/20 rounded-xl blur-lg group-hover:opacity-75 transition duration-500"></div>
            <img
              src="/banner.jpg"
              alt="About Upkrit"
              className="relative z-10 rounded-xl shadow-2xl object-cover w-full h-96 transform transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
