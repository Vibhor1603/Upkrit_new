import { useState, useEffect } from "react";
import {
  Upload,
  AlertCircle,
  CheckCircle,
  XCircle,
  Send,
  Calendar,
  MapPin,
  Trash2,
  FileImage,
  Camera,
  Clock,
  User,
  Menu,
  Search,
  Bell,
  Settings,
  Home,
} from "lucide-react";

// Modern Navbar Component
const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md px-4 py-3 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="bg-green-500 rounded-full p-1">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-green-600">EcoReport</span>
          </div>

          <div className="hidden md:flex space-x-6">
            <a
              href="#"
              className="text-gray-600 hover:text-green-600 font-medium"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-green-600 font-medium"
            >
              Reports
            </a>
            <a
              href="#"
              className="text-green-600 border-b-2 border-green-500 font-medium"
            >
              New Report
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-green-600 font-medium"
            >
              Resources
            </a>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Search className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-0 right-0 bg-red-500 rounded-full w-2 h-2"></span>
          </button>
          <div className="hidden md:flex items-center space-x-2">
            <div className="bg-green-100 rounded-full p-1">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <span className="font-medium text-gray-700">User</span>
          </div>
          <button className="block md:hidden p-2 rounded-full hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </nav>
  );
};

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    date: "",
    location: "",
    media: null,
  });

  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setFormVisible(true), 100);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(files[0]);

      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileRemove = () => {
    setPreviewUrl(null);
    setFormData({
      ...formData,
      media: null,
    });

    // Reset the file input
    const fileInput = document.getElementById("media");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        data.append(key, value);
      }
    });

    try {
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock successful submission
      setSubmissionStatus("success");
      setPreviewUrl(null);
      setFormData({
        title: "",
        type: "",
        description: "",
        date: "",
        location: "",
        media: null,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);

      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmissionStatus(null);
      }, 5000);
    }
  };

  const complaintTypes = [
    { value: "garbage", label: "Garbage Collection" },
    { value: "sanitation", label: "Sanitation Issues" },
    { value: "water", label: "Water Pollution" },
    { value: "air", label: "Air Quality" },
    { value: "noise", label: "Noise Pollution" },
    { value: "wildlife", label: "Wildlife Concerns" },
    { value: "construction", label: "Illegal Construction" },
    { value: "other", label: "Other Environmental Concern" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 min-h-screen pt-24 pb-8 px-4">
        <div
          className={`w-full max-w-3xl transform transition-all duration-700 ${
            formVisible
              ? "opacity-100 translate-y-0 animate-zoom-in"
              : "opacity-0 translate-y-8"
          }`}
        >
          {/* Card with floating effect */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-float">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-5">
              <div className="flex items-center justify-center space-x-3 mb-1">
                <AlertCircle className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">
                  Environmental Report
                </h2>
              </div>
              <p className="text-center text-green-50 opacity-90 text-sm">
                Help us make our community cleaner and safer for everyone
              </p>
            </div>

            {/* Form Body */}
            <div className="p-5 bg-white">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title Input */}
                <div
                  className="space-y-1 animate-slide-up"
                  style={{ animationDelay: "100ms" }}
                >
                  <label
                    htmlFor="title"
                    className="block text-gray-700 font-medium text-sm"
                  >
                    What's the issue?
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Briefly describe your environmental concern"
                    required
                  />
                </div>

                {/* Two column layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Type Dropdown */}
                  <div
                    className="space-y-1 animate-slide-up"
                    style={{ animationDelay: "200ms" }}
                  >
                    <label
                      htmlFor="type"
                      className="block text-gray-700 font-medium text-sm"
                    >
                      Complaint Category
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-3 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white appearance-none pr-10"
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a category</option>
                        {complaintTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                        <svg
                          className="h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Date Input */}
                  <div
                    className="space-y-1 animate-slide-up"
                    style={{ animationDelay: "300ms" }}
                  >
                    <label
                      htmlFor="date"
                      className="block text-gray-700 font-medium text-sm flex items-center"
                    >
                      <Clock className="mr-1 w-3 h-3 text-green-500" />
                      When did you notice it?
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Description Textarea */}
                <div
                  className="space-y-1 animate-slide-up"
                  style={{ animationDelay: "400ms" }}
                >
                  <label
                    htmlFor="description"
                    className="block text-gray-700 font-medium text-sm"
                  >
                    Detailed Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Please provide complete details about the environmental issue"
                    required
                  />
                </div>

                {/* Location Input */}
                <div
                  className="space-y-1 animate-slide-up"
                  style={{ animationDelay: "500ms" }}
                >
                  <label
                    htmlFor="location"
                    className="block text-gray-700 font-medium text-sm flex items-center"
                  >
                    <MapPin className="mr-1 w-3 h-3 text-green-500" />
                    Location
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Address or landmark"
                    required
                  />
                </div>

                {/* Media Upload */}
                <div
                  className="space-y-1 animate-slide-up"
                  style={{ animationDelay: "600ms" }}
                >
                  <label
                    htmlFor="media"
                    className="block text-gray-700 font-medium text-sm flex items-center"
                  >
                    <Camera className="mr-1 w-3 h-3 text-green-500" />
                    Evidence (Photo/Video)
                  </label>

                  {previewUrl ? (
                    <div className="mt-1 overflow-hidden group relative rounded-lg border-2 border-green-200 bg-white">
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          src={previewUrl}
                          alt="Evidence Preview"
                          className="object-cover w-full h-full rounded-lg"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleFileRemove}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md opacity-90 transition-all duration-200 transform hover:scale-105"
                        aria-label="Remove image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        className="w-full h-20 px-3 py-6 border-2 border-dashed border-green-200 rounded-lg focus:outline-none focus:border-green-500 transition-all duration-200 bg-white file:hidden cursor-pointer text-transparent"
                        id="media"
                        name="media"
                        accept="image/*,video/*"
                        onChange={handleChange}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-gray-500">
                        <FileImage className="w-6 h-6 mb-1 text-green-400" />
                        <p className="text-center text-xs">
                          <span className="font-medium text-green-600">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                          <br />
                          <span className="text-gray-400">
                            JPG, PNG, or MP4 (max. 10MB)
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div
                  className="pt-2 animate-slide-up"
                  style={{ animationDelay: "700ms" }}
                >
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center space-x-2 shadow-md transition-all duration-300 transform hover:translate-y-[-1px] ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Report</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Status Message */}
              {submissionStatus && (
                <div
                  className={`mt-4 p-3 rounded-lg flex items-center shadow-md animate-fade-in ${
                    submissionStatus === "success"
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-red-100 text-red-800 border border-red-200"
                  }`}
                >
                  {submissionStatus === "success" ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mr-2" />
                      <div>
                        <h4 className="font-bold text-green-700 text-sm">
                          Thank You!
                        </h4>
                        <p className="text-green-600 text-xs">
                          Your environmental report has been submitted
                          successfully.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mr-2" />
                      <div>
                        <h4 className="font-bold text-red-700 text-sm">
                          Submission Error
                        </h4>
                        <p className="text-red-600 text-xs">
                          There was a problem with your submission. Please try
                          again.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-white border-t border-green-100 text-center text-gray-500 text-xs">
              Your report helps us protect our environment. Thank you for your
              contribution.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return <ComplaintForm />;
}
