import { useEffect, useState, useRef } from "react";
import { User, Mail, MapPin, Calendar, Clock, FileText, Users, LogOut, ClipboardList, PlusCircle, Trash2, LoaderCircle } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [drives, setDrives] = useState([]);
  const [joinedDrives, setJoinedDrives] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [leaveModal, setLeaveModal] = useState({ open: false, driveId: null });
  const [leaveTimer, setLeaveTimer] = useState(5);
  const leaveInterval = useRef(null);

  useEffect(() => {
    setUser({
      username: localStorage.getItem("username") || "Anonymous",
      email: localStorage.getItem("email") || "anonymous@example.com",
    });

    // Fetch drives from localStorage
    const stored = localStorage.getItem("markersData");
    const username = localStorage.getItem("username") || "Anonymous";
    if (stored) {
      try {
        const allDrives = JSON.parse(stored);
        setDrives(
          allDrives.filter(
            (drive) => drive.startedBy === username || drive.username === username
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
        setJoinedDrives(allJoined.filter(j => j.username === username));
      } catch {
        setJoinedDrives([]);
      }
    } else {
      setJoinedDrives([]);
    }

    // Fetch complaints from localStorage
    const complaintsStored = localStorage.getItem("complaintsData");
    if (complaintsStored) {
      try {
        const allComplaints = JSON.parse(complaintsStored);
        setComplaints(
          allComplaints.filter(
            (c) => c.username === username
          )
        );
      } catch (err) {
        setComplaints([]);
      }
    } else {
      setComplaints([]);
    }
  }, []);

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
    const updated = joined.filter(j => !(j.id === driveId && j.username === username));
    localStorage.setItem("joinedDrives", JSON.stringify(updated));
    setJoinedDrives(updated.filter(j => j.username === username));
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (leaveInterval.current) clearInterval(leaveInterval.current);
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center gap-8 mb-12 bg-gradient-to-r from-green-200 to-blue-200 rounded-xl shadow-lg p-10 mt-16">
        <div className="bg-green-600 text-white rounded-full p-6 flex items-center justify-center">
          <User size={44} />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-green-900 flex items-center gap-4">
            {user?.username} <span className="text-green-500"><Users size={32} /></span>
          </h1>
          <div className="text-2xl text-gray-800 flex items-center gap-3 mt-2">
            <Mail size={22} className="text-blue-600" /> {user?.email}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-16">
        {/* Drives Section */}
        <div className="w-full bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-10 mb-10">
          <h2 className="text-2xl font-semibold mb-10 text-green-700 flex items-center gap-3"><PlusCircle size={24}/> Drives Created</h2>
          {drives.length === 0 ? (
            <div className="text-gray-600 flex items-center gap-3 text-lg"><ClipboardList size={20}/> No drives created yet.</div>
          ) : (
            <ul className="flex flex-col gap-10">
              {drives.map((drive) => (
                <li key={drive.id} className="bg-white p-8 rounded-2xl shadow flex flex-col gap-4 border border-green-100">
                  <div className="font-bold text-green-800 text-2xl mb-2 flex items-center gap-3"><FileText size={22}/> {drive.objective}</div>
                  <div className="text-base text-gray-700 mb-1 flex items-center gap-2">
                    <MapPin size={16}/> <span className="font-semibold">Location:</span> {drive.location}
                  </div>
                  <div className="text-base text-gray-700 mb-1 flex items-center gap-2">
                    <Calendar size={16}/> <span className="font-semibold">Date:</span> {drive.date} <Clock size={16} className="ml-2"/> <span className="font-semibold">Time:</span> {drive.time}
                  </div>
                  <div className="text-base text-gray-700 mb-1 flex items-center gap-2">
                    <FileText size={16}/> <span className="font-semibold">Abstract:</span> {drive.abstract}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Joined Drives Section */}
        <div className="w-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-10 mb-10">
          <h2 className="text-2xl font-semibold mb-10 text-blue-700 flex items-center gap-3"><Users size={24}/> Joined Drives</h2>
          {joinedDrives.length === 0 ? (
            <div className="text-gray-600 flex items-center gap-3 text-lg"><ClipboardList size={20}/> No drives joined yet.</div>
          ) : (
            <ul className="flex flex-col gap-10">
              {joinedDrives.map((drive) => (
                <li key={drive.id} className="bg-white p-8 rounded-2xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-6 border border-blue-100">
                  <div>
                    <div className="font-bold text-blue-800 text-2xl mb-2 flex items-center gap-3"><FileText size={22}/> {drive.objective}</div>
                    <div className="text-base text-gray-700 mb-1 flex items-center gap-2">
                      <MapPin size={16}/> <span className="font-semibold">Location:</span> {drive.location}
                    </div>
                    <div className="text-base text-gray-700 mb-1 flex items-center gap-2">
                      <Calendar size={16}/> <span className="font-semibold">Date:</span> {drive.date} <Clock size={16} className="ml-2"/> <span className="font-semibold">Time:</span> {drive.time}
                    </div>
                    <div className="text-base text-gray-700 mb-1 flex items-center gap-2">
                      <FileText size={16}/> <span className="font-semibold">Abstract:</span> {drive.abstract}
                    </div>
                  </div>
                  <button
                    className="mt-4 md:mt-0 px-5 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-semibold flex items-center gap-2 text-lg"
                    onClick={() => handleLeaveDrive(drive.id)}
                  >
                    <Trash2 size={18}/> Leave Drive
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Complaints Section */}
        <div className="w-full bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-lg p-10">
          <h2 className="text-2xl font-semibold mb-10 text-red-700 flex items-center gap-3"><ClipboardList size={24}/> Registered Complaints</h2>
          {complaints.length === 0 ? (
            <div className="text-gray-600 flex items-center gap-3 text-lg"><ClipboardList size={20}/> No complaints registered yet.</div>
          ) : (
            <ul className="flex flex-col gap-10">
              {complaints.map((complaint, idx) => (
                <li key={idx} className="bg-white p-8 rounded-2xl shadow border border-red-100">
                  <div className="font-bold text-red-800 text-2xl mb-2 flex items-center gap-3"><FileText size={22}/> {complaint.subject}</div>
                  <div className="text-base text-gray-700 mb-2 flex items-center gap-2">
                    <span className="font-semibold">Description:</span> {complaint.description}
                  </div>
                  <div className="text-base text-gray-700 mb-1 flex items-center gap-2">
                    <Calendar size={16}/> <span className="font-semibold">Date:</span> {complaint.date}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Leave Drive Modal */}
      {leaveModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center w-[350px] relative">
            <LoaderCircle className="animate-spin text-blue-600 mb-4" size={48}/>
            <div className="text-xl font-semibold mb-2 text-gray-800">Are you sure you want to leave this drive?</div>
            <div className="mb-6 text-gray-600">Confirm within <span className="font-bold text-blue-700">{leaveTimer}</span> second{leaveTimer !== 1 && 's'}.</div>
            <div className="flex gap-4">
              <button
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                onClick={confirmLeaveDrive}
              >
                Yes, Leave
              </button>
              <button
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                onClick={() => { if (leaveInterval.current) clearInterval(leaveInterval.current); setLeaveModal({ open: false, driveId: null }); }}
              >
                Cancel
              </button>
            </div>
            <div className="absolute top-3 right-5 cursor-pointer text-gray-400 hover:text-gray-700" onClick={() => { if (leaveInterval.current) clearInterval(leaveInterval.current); setLeaveModal({ open: false, driveId: null }); }}>
              ×
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
