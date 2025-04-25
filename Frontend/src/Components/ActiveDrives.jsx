import { useEffect, useState, useRef } from "react";
import { LoaderCircle } from "lucide-react";

export default function ActiveDrives() {
  const [drives, setDrives] = useState([]);
  const [joinedDrives, setJoinedDrives] = useState([]);
  const [joining, setJoining] = useState(null); // id of drive being joined
  const [joinModal, setJoinModal] = useState({ open: false, drive: null });
  const [joinTimer, setJoinTimer] = useState(5);
  const joinInterval = useRef(null);
  const username = localStorage.getItem("username") || "Anonymous";

  useEffect(() => {
    // Fetch all drives from localStorage
    const stored = localStorage.getItem("markersData");
    let allDrives = [];
    if (stored) {
      try {
        allDrives = JSON.parse(stored);
      } catch {
        allDrives = [];
      }
    }
    setDrives(allDrives);
    // Fetch joined drives for this user
    const joinedStored = localStorage.getItem("joinedDrives");
    let joined = [];
    if (joinedStored) {
      try {
        joined = JSON.parse(joinedStored).filter(j => j.username === username);
      } catch {
        joined = [];
      }
    }
    setJoinedDrives(joined);
  }, [joining]);

  const isDriveJoined = (driveId) => joinedDrives.some(j => j.id === driveId);

  const handleJoin = (drive) => {
    setJoinModal({ open: true, drive });
    setJoinTimer(5);
    if (joinInterval.current) clearInterval(joinInterval.current);
    joinInterval.current = setInterval(() => {
      setJoinTimer((t) => {
        if (t <= 1) {
          clearInterval(joinInterval.current);
          setJoinModal({ open: false, drive: null });
          return 5;
        }
        return t - 1;
      });
    }, 1000);
  };

  const confirmJoinDrive = () => {
    if (joinInterval.current) clearInterval(joinInterval.current);
    const drive = joinModal.drive;
    setJoinModal({ open: false, drive: null });
    // Mock logic: save to localStorage
    const joinedStored = localStorage.getItem("joinedDrives");
    let joined = [];
    if (joinedStored) {
      try {
        joined = JSON.parse(joinedStored);
      } catch {
        joined = [];
      }
    }
    if (!joined.find(j => j.id === drive.id && j.username === username)) {
      joined.push({ ...drive, username });
      localStorage.setItem("joinedDrives", JSON.stringify(joined));
    }
    setJoining(null);
  };

  useEffect(() => {
    return () => {
      if (joinInterval.current) clearInterval(joinInterval.current);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Active Drives</h1>
      {drives.length === 0 ? (
        <div className="text-gray-600">No drives available at the moment.</div>
      ) : (
        <ul className="space-y-6">
          {drives.map((drive) => (
            <li key={drive.id} className="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-bold text-xl text-blue-700 mb-1">{drive.objective}</div>
                <div className="text-sm text-gray-700 mb-1">
                  <span className="font-semibold">Location:</span> {drive.location}
                </div>
                <div className="text-sm text-gray-700 mb-1">
                  <span className="font-semibold">Date:</span> {drive.date} <span className="ml-2 font-semibold">Time:</span> {drive.time}
                </div>
                <div className="text-sm text-gray-700 mb-1">
                  <span className="font-semibold">Abstract:</span> {drive.abstract}
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                {isDriveJoined(drive.id) ? (
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded font-semibold">Joined</span>
                ) : (
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
                    disabled={joining === drive.id}
                    onClick={() => handleJoin(drive)}
                  >
                    Join Drive
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {/* Join Drive Modal */}
      {joinModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center w-[350px] relative">
            <LoaderCircle className="animate-spin text-blue-600 mb-4" size={48}/>
            <div className="text-xl font-semibold mb-2 text-gray-800">Join this drive?</div>
            <div className="mb-6 text-gray-600">Confirm within <span className="font-bold text-blue-700">{joinTimer}</span> second{joinTimer !== 1 && 's'}.</div>
            <div className="flex gap-4">
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                onClick={confirmJoinDrive}
              >
                Yes, Join
              </button>
              <button
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                onClick={() => { if (joinInterval.current) clearInterval(joinInterval.current); setJoinModal({ open: false, drive: null }); }}
              >
                Cancel
              </button>
            </div>
            <div className="absolute top-3 right-5 cursor-pointer text-gray-400 hover:text-gray-700" onClick={() => { if (joinInterval.current) clearInterval(joinInterval.current); setJoinModal({ open: false, drive: null }); }}>
              ×
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
