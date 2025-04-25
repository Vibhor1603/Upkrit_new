import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [drives, setDrives] = useState([]);
  const [complaints, setComplaints] = useState([]);

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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-green-800">Profile</h1>
      {user && (
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="mb-2">
            <span className="font-semibold">Username:</span> {user.username}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Email:</span> {user.email}
          </div>
        </div>
      )}
      <h2 className="text-xl font-semibold mb-4 text-green-700">Drives Created</h2>
      {drives.length === 0 ? (
        <div className="text-gray-600">No drives created yet.</div>
      ) : (
        <ul className="space-y-4">
          {drives.map((drive) => (
            <li key={drive.id} className="bg-green-50 p-4 rounded shadow">
              <div className="font-bold text-green-800 text-lg mb-1">{drive.objective}</div>
              <div className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">Location:</span> {drive.location}
              </div>
              <div className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">Date:</span> {drive.date} <span className="ml-2 font-semibold">Time:</span> {drive.time}
              </div>
              <div className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">Abstract:</span> {drive.abstract}
              </div>
            </li>
          ))}
        </ul>
      )}
      <h2 className="text-xl font-semibold mb-4 text-green-700">Registered Complaints</h2>
      {complaints.length === 0 ? (
        <div className="text-gray-600">No complaints registered yet.</div>
      ) : (
        <ul className="space-y-4">
          {complaints.map((complaint) => (
            <li key={complaint.id} className="bg-red-50 p-4 rounded shadow">
              <div className="font-bold text-red-800 text-lg mb-1">{complaint.title}</div>
              <div className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">Type:</span> {complaint.type}
              </div>
              <div className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">Location:</span> {complaint.location}
              </div>
              <div className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">Date:</span> {complaint.date}
              </div>
              <div className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">Description:</span> {complaint.description}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
