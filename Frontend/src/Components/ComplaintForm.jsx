import { useState } from "react";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      // Create preview URL for uploaded file
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("type", formData.type);
    data.append("description", formData.description);
    data.append("date", formData.date);
    data.append("location", formData.location);
    if (formData.media) {
      data.append("media", formData.media);
    }

    try {
      const response = await fetch("http://localhost:5000/api/complaint", {
        method: "POST",
        body: data,
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Form submitted successfully:", result);
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
      } else {
        console.error("Error submitting form:", response.statusText);
        setSubmissionStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionStatus("error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className="max-w-xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]"
        style={{
          backgroundImage: "linear-gradient(to bottom right, #f0f9f0, #e6f3e6)",
          boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
        }}
      >
        <div className="p-6 sm:p-8">
          <h3 className="text-3xl font-extrabold text-center mb-6 text-green-900 flex items-center justify-center">
            <AlertCircle className="mr-3 w-8 h-8 text-green-600" />
            Complaint Form
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="block text-green-800 font-semibold mb-2"
              >
                Complaint Title
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 bg-green-50"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Describe your complaint briefly"
                required
              />
            </div>

            {/* Type Dropdown */}
            <div>
              <label
                htmlFor="type"
                className="block text-green-800 font-semibold mb-2"
              >
                Complaint Type
              </label>
              <select
                className="w-full px-4 py-2.5 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 bg-green-50"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select Complaint Type</option>
                <option value="garbage">Garbage</option>
                <option value="sanitation">Sanitation</option>
                <option value="other">other</option>
              </select>
            </div>

            {/* Description Textarea */}
            <div>
              <label
                htmlFor="description"
                className="block text-green-800 font-semibold mb-2"
              >
                Detailed Description
              </label>
              <textarea
                className="w-full px-4 py-2.5 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 bg-green-50"
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a comprehensive description of your environmental concern"
                required
              />
            </div>

            {/* Date Input */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-green-800 font-semibold mb-2"
                >
                  Incident Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 bg-green-50"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Location Input */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-green-800 font-semibold mb-2"
                >
                  Location
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 bg-green-50"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Coordinates, or Specific Area"
                  required
                />
              </div>
            </div>

            {/* Media Upload */}
            <div>
              <label
                htmlFor="media"
                className="block text-green-800 font-semibold mb-2"
              >
                <Upload className="mr-2 inline text-green-600 w-5 h-5" />
                Supporting Evidence
              </label>
              <input
                type="file"
                className="w-full px-4 py-2.5 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 bg-green-50 file:mr-4 file:rounded-full file:border-0 file:bg-green-100 file:px-4 file:py-2 file:text-green-700"
                id="media"
                name="media"
                accept="image/*,video/*"
                onChange={handleChange}
              />
              {previewUrl && (
                <div className="mt-4">
                  <img
                    src={previewUrl}
                    alt="Evidence Preview"
                    className="max-h-48 w-full object-cover rounded-xl shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-all duration-300 flex items-center justify-center space-x-2 font-bold tracking-wide"
            >
              <FileText className="w-5 h-5" />
              <span>Submit Environmental Report</span>
            </button>
          </form>

          {/* Status Message */}
          {submissionStatus && (
            <div
              className={`mt-4 p-3 rounded-xl text-center flex items-center justify-center space-x-2 ${
                submissionStatus === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {submissionStatus === "success" ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Complaint Submitted Successfully!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span>Error Submitting Complaint. Please Try Again.</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;
