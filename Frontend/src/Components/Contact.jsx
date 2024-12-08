import { useState } from "react";
import { MapPin, Mail, Phone, Send } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    console.log("Form submitted:", formData);
    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <section
      id="contact"
      className="py-16 bg-gradient-to-br from-green-50 to-green-100"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-green-800 mb-4">Contact Us</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            We would love to hear from you. Reach out and let us make a
            difference together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-green-500 
                    transition duration-300"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-green-500 
                    transition duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-700 mb-2">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-green-500 
                    transition duration-300 resize-none"
                  placeholder="Enter your message"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg 
                  hover:bg-green-700 transition duration-300 
                  flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <h3 className="text-2xl font-semibold text-green-800 mb-6">
              Contact Information
            </h3>

            <div className="flex items-center space-x-4 bg-green-50 p-4 rounded-lg">
              <MapPin className="w-8 h-8 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-800">Location</h4>
                <p className="text-gray-700">ABESIT, Ghaziabad</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-green-50 p-4 rounded-lg">
              <Mail className="w-8 h-8 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-800">Email</h4>
                <p className="text-gray-700">info@upkrit.com</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-green-50 p-4 rounded-lg">
              <Phone className="w-8 h-8 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-800">Call</h4>
                <p className="text-gray-700">+91 xxxxx456</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
