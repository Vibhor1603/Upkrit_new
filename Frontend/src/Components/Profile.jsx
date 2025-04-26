import { useEffect, useState, useRef } from "react";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Users,
  LogOut,
  ClipboardList,
  PlusCircle,
  Trash2,
  LoaderCircle,
  AlertCircle,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [drives, setDrives] = useState([]);
  const [joinedDrives, setJoinedDrives] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [complaintsLoading, setComplaintsLoading] = useState(false);
  const [complaintsError, setComplaintsError] = useState(null);
  const [leaveModal, setLeaveModal] = useState({ open: false, driveId: null });
  const [leaveTimer, setLeaveTimer] = useState(5);
  const [activeTab, setActiveTab] = useState("drives");
  const [notification, setNotification] = useState(null);
  const leaveInterval = useRef(null);

  useEffect(() => {
    const username = localStorage.getItem("username") || "Anonymous";
    const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage

    setUser({
      username: username,
      email: localStorage.getItem("email") || "anonymous@example.com",
      id: userId,
    });

    // Fetch drives from localStorage
    const stored = localStorage.getItem("markersData");
    if (stored) {
      try {
        const allDrives = JSON.parse(stored);
        setDrives(
          allDrives.filter(
            (drive) =>
              drive.startedBy === username || drive.username === username
          )
        );
      } catch (err) {
        setDrives([]);
      }
    } else {
      setDrives([]);
    }

    // Fetch joined drives from localStorage
    const joinedStored = localStorage.getItem("joinedDrives");
    if (joinedStored) {
      try {
        const allJoined = JSON.parse(joinedStored);
        setJoinedDrives(allJoined.filter((j) => j.username === username));
      } catch {
        setJoinedDrives([]);
      }
    } else {
      setJoinedDrives([]);
    }

    // Fetch complaints from the API instead of localStorage
    if (userId) {
      fetchUserComplaints(userId);
    } else {
      // If no userId is available, fetch from localStorage as fallback
      const complaintsStored = localStorage.getItem("complaintsData");
      if (complaintsStored) {
        try {
          const allComplaints = JSON.parse(complaintsStored);
          setComplaints(allComplaints.filter((c) => c.username === username));
        } catch (err) {
          setComplaints([]);
        }
      } else {
        setComplaints([]);
      }
    }
  }, []);

  // New function to fetch complaints from the API
  const fetchUserComplaints = async (userId) => {
    try {
      setComplaintsLoading(true);
      setComplaintsError(null);

      const response = await fetch(
        `http://localhost:5000/api/complaint/user/${userId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching complaints: ${response.statusText}`);
      }

      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
      setComplaintsError(error.message);

      // Fallback to localStorage if API fails
      const complaintsStored = localStorage.getItem("complaintsData");
      if (complaintsStored) {
        try {
          const allComplaints = JSON.parse(complaintsStored);
          const username = localStorage.getItem("username") || "Anonymous";
          setComplaints(allComplaints.filter((c) => c.username === username));
        } catch (err) {
          setComplaints([]);
        }
      }
    } finally {
      setComplaintsLoading(false);
    }
  };

  // Show modal for 5 seconds, if not confirmed, auto-close
  const handleLeaveDrive = (driveId) => {
    setLeaveModal({ open: true, driveId });
    setLeaveTimer(5);
    if (leaveInterval.current) clearInterval(leaveInterval.current);
    leaveInterval.current = setInterval(() => {
      setLeaveTimer((t) => {
        if (t <= 1) {
          clearInterval(leaveInterval.current);
          setLeaveModal({ open: false, driveId: null });
          return 5;
        }
        return t - 1;
      });
    }, 1000);
  };

  // Actually remove joined drive
  const confirmLeaveDrive = () => {
    if (leaveInterval.current) clearInterval(leaveInterval.current);
    const driveId = leaveModal.driveId;
    setLeaveModal({ open: false, driveId: null });
    const joinedStored = localStorage.getItem("joinedDrives");
    let joined = [];
    if (joinedStored) {
      try {
        joined = JSON.parse(joinedStored);
      } catch {
        joined = [];
      }
    }
    const username = localStorage.getItem("username") || "Anonymous";
    const updated = joined.filter(
      (j) => !(j.id === driveId && j.username === username)
    );
    localStorage.setItem("joinedDrives", JSON.stringify(updated));
    setJoinedDrives(updated.filter((j) => j.username === username));

    // Show notification
    setNotification({
      type: "success",
      message: "Successfully left the drive",
    });
    setTimeout(() => setNotification(null), 3000);
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (leaveInterval.current) clearInterval(leaveInterval.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-radial from-gray-50 mt-8 to-gray-100">
      {/* Header with user profile */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-r from-green-500 to-green-600 p-8 mt-8 animate-fade-in">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
          <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-white opacity-10 rounded-full"></div>

          <div className="flex flex-col md:flex-row items-center gap-6 z-10 relative">
            <div className="bg-white text-green-600 rounded-full p-6 shadow-lg animate-float">
              <User size={44} />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-display font-bold text-white flex items-center justify-center md:justify-start gap-4">
                {user?.username}
                <span className="bg-white/20 rounded-full p-1.5">
                  <Users size={24} className="text-white" />
                </span>
              </h1>
              <div className="text-xl text-white/90 flex items-center justify-center md:justify-start gap-3 mt-2">
                <Mail size={20} className="text-white/80" /> {user?.email}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="flex">
            <button
              className={`flex-1 py-4 px-6 text-lg font-medium ${
                activeTab === "drives"
                  ? "bg-green-50 text-green-600 border-b-2 border-green-500"
                  : "text-gray-600 hover:bg-gray-50"
              } transition-all duration-300 flex items-center justify-center gap-2`}
              onClick={() => setActiveTab("drives")}
            >
              <PlusCircle size={20} />
              <span>My Drives</span>
            </button>
            <button
              className={`flex-1 py-4 px-6 text-lg font-medium ${
                activeTab === "joined"
                  ? "bg-green-50 text-green-600 border-b-2 border-green-500"
                  : "text-gray-600 hover:bg-gray-50"
              } transition-all duration-300 flex items-center justify-center gap-2`}
              onClick={() => setActiveTab("joined")}
            >
              <Users size={20} />
              <span>Joined Drives</span>
            </button>
            <button
              className={`flex-1 py-4 px-6 text-lg font-medium ${
                activeTab === "complaints"
                  ? "bg-green-50 text-green-600 border-b-2 border-green-500"
                  : "text-gray-600 hover:bg-gray-50"
              } transition-all duration-300 flex items-center justify-center gap-2`}
              onClick={() => setActiveTab("complaints")}
            >
              <ClipboardList size={20} />
              <span>Complaints</span>
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="mt-6 mb-16">
          {/* My Drives Section */}
          {activeTab === "drives" && (
            <div className="animate-slide-up">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-semibold text-gray-800 flex items-center gap-3">
                  <span className="bg-green-100 text-green-600 p-2 rounded-lg">
                    <PlusCircle size={24} />
                  </span>
                  My Drives
                </h2>
                <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full font-medium">
                  {drives.length} drives
                </span>
              </div>

              {drives.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
                  <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <ClipboardList size={28} className="text-gray-400" />
                  </div>
                  <div className="text-xl font-medium text-gray-500 mb-2">
                    No drives created yet
                  </div>
                  <p className="text-gray-400">Create a drive to see it here</p>
                  <button className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto">
                    <PlusCircle size={18} /> Create Drive
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {drives.map((drive, index) => (
                    <div
                      key={drive.id}
                      className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="bg-gradient-to-r from-green-400 to-green-500 h-3"></div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-gray-800 text-xl group-hover:text-green-600 transition-colors line-clamp-1">
                            {drive.objective}
                          </h3>
                          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                            Active
                          </span>
                        </div>

                        <div className="space-y-3 text-gray-600">
                          <div className="flex items-start gap-3">
                            <MapPin
                              size={18}
                              className="mt-0.5 text-green-500 flex-shrink-0"
                            />
                            <span className="line-clamp-1">
                              {drive.location}
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <Calendar
                              size={18}
                              className="mt-0.5 text-green-500 flex-shrink-0"
                            />
                            <div>
                              <span>{drive.date}</span>
                              <span className="mx-2">•</span>
                              <span>{drive.time}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <FileText
                              size={18}
                              className="mt-0.5 text-green-500 flex-shrink-0"
                            />
                            <span className="line-clamp-2">
                              {drive.abstract}
                            </span>
                          </div>
                        </div>

                        <button className="mt-6 w-full py-2 border border-green-200 hover:bg-green-50 text-green-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                          <FileText size={18} /> View Details{" "}
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Joined Drives Section */}
          {activeTab === "joined" && (
            <div className="animate-slide-up">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-semibold text-gray-800 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    <Users size={24} />
                  </span>
                  Joined Drives
                </h2>
                <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full font-medium">
                  {joinedDrives.length} drives
                </span>
              </div>

              {joinedDrives.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
                  <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Users size={28} className="text-gray-400" />
                  </div>
                  <div className="text-xl font-medium text-gray-500 mb-2">
                    No drives joined yet
                  </div>
                  <p className="text-gray-400">Join a drive to see it here</p>
                  <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto">
                    <Users size={18} /> Browse Drives
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {joinedDrives.map((drive, index) => (
                    <div
                      key={drive.id}
                      className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-3"></div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-gray-800 text-xl group-hover:text-blue-600 transition-colors line-clamp-1">
                            {drive.objective}
                          </h3>
                          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                            Joined
                          </span>
                        </div>

                        <div className="space-y-3 text-gray-600">
                          <div className="flex items-start gap-3">
                            <MapPin
                              size={18}
                              className="mt-0.5 text-blue-500 flex-shrink-0"
                            />
                            <span className="line-clamp-1">
                              {drive.location}
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <Calendar
                              size={18}
                              className="mt-0.5 text-blue-500 flex-shrink-0"
                            />
                            <div>
                              <span>{drive.date}</span>
                              <span className="mx-2">•</span>
                              <span>{drive.time}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <FileText
                              size={18}
                              className="mt-0.5 text-blue-500 flex-shrink-0"
                            />
                            <span className="line-clamp-2">
                              {drive.abstract}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                          <button className="flex-1 py-2 border border-blue-200 hover:bg-blue-50 text-blue-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                            <FileText size={18} /> View
                          </button>
                          <button
                            className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            onClick={() => handleLeaveDrive(drive.id)}
                          >
                            <Trash2 size={18} /> Leave
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Complaints Section */}
          {activeTab === "complaints" && (
            <div className="animate-slide-up">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-semibold text-gray-800 flex items-center gap-3">
                  <span className="bg-red-100 text-red-600 p-2 rounded-lg">
                    <ClipboardList size={24} />
                  </span>
                  Complaints
                </h2>
                <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full font-medium">
                  {complaints.length} complaints
                </span>
              </div>

              {complaintsLoading ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
                  <div className="mt-4 text-gray-600">
                    Loading your complaints...
                  </div>
                </div>
              ) : complaintsError ? (
                <div className="bg-white rounded-xl shadow-md p-8 border border-red-100 text-center">
                  <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={28} className="text-red-500" />
                  </div>
                  <div className="text-xl font-medium text-red-500 mb-2">
                    Error loading complaints
                  </div>
                  <p className="text-gray-600 mb-4">{complaintsError}</p>
                  <button
                    onClick={() => fetchUserComplaints(user.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : complaints.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
                  <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <ClipboardList size={28} className="text-gray-400" />
                  </div>
                  <div className="text-xl font-medium text-gray-500 mb-2">
                    No complaints registered
                  </div>
                  <p className="text-gray-400">
                    Register a complaint when needed
                  </p>
                  <button className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto">
                    <ClipboardList size={18} /> Register Complaint
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {complaints.map((complaint, index) => (
                    <div
                      key={complaint._id || complaint.id || index}
                      className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="bg-gradient-to-r from-red-400 to-red-500 h-3"></div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-gray-800 text-xl hover:text-red-600 transition-colors">
                            {complaint.title || complaint.subject}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              complaint.status === "resolved"
                                ? "bg-green-100 text-green-600"
                                : complaint.status === "in-progress"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {complaint.status
                              ? complaint.status.charAt(0).toUpperCase() +
                                complaint.status.slice(1)
                              : "Pending"}
                          </span>
                        </div>

                        <div className="space-y-3 text-gray-600">
                          <div className="flex items-start gap-3">
                            <FileText
                              size={18}
                              className="mt-0.5 text-red-500 flex-shrink-0"
                            />
                            <span className="line-clamp-3">
                              {complaint.description}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <Calendar size={18} className="text-red-500" />
                            <span>
                              {new Date(complaint.date).toLocaleDateString()}
                            </span>
                          </div>
                          {complaint.location && (
                            <div className="flex items-center gap-3">
                              <MapPin size={18} className="text-red-500" />
                              <span className="line-clamp-1">
                                {complaint.location}
                              </span>
                            </div>
                          )}
                        </div>

                        <button className="mt-6 w-full py-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                          <FileText size={18} /> View Details{" "}
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Leave Drive Modal */}
      {leaveModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full animate-zoom-in">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-5">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-800 mb-2">
                Leave this drive?
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to leave this drive? This action cannot be
                undone.
              </p>
              <div className="flex items-center mb-6">
                <span className="text-red-500 font-bold text-xl countdown-timer">
                  {leaveTimer}
                </span>
                <span className="text-gray-500 ml-2">
                  seconds remaining to confirm
                </span>
              </div>
              <div className="flex gap-4 w-full">
                <button
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                  onClick={() => {
                    if (leaveInterval.current)
                      clearInterval(leaveInterval.current);
                    setLeaveModal({ open: false, driveId: null });
                  }}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  onClick={confirmLeaveDrive}
                >
                  <Trash2 size={18} /> Leave Drive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border-l-4 ${
            notification.type === "success"
              ? "border-l-green-500"
              : "border-l-red-500"
          } p-4 max-w-sm w-full animate-slide-right z-50`}
        >
          <div className="flex items-center gap-3">
            {notification.type === "success" ? (
              <CheckCircle size={24} className="text-green-500" />
            ) : (
              <AlertCircle size={24} className="text-red-500" />
            )}
            <span className="font-medium text-gray-800">
              {notification.message}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
