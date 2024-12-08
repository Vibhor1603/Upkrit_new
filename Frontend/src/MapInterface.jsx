/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom icons
const createMarkerIcon = (iconUrl) =>
  new L.Icon({
    iconUrl: iconUrl,
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
  });

const markerIcons = {
  dustbin: createMarkerIcon(
    "https://img.icons8.com/?size=100&id=XagCCrrdmgQu&format=png&color=000000"
  ),
  tshirt: createMarkerIcon(
    "https://img.icons8.com/?size=100&id=9158&format=png&color=000000"
  ),
  plant: createMarkerIcon(
    "https://img.icons8.com/?size=100&id=19166&format=png&color=000000"
  ),
  user: createMarkerIcon(
    "https://img.icons8.com/?size=100&id=98957&format=png&color=000000"
  ),
};

// Location tracking component
const LocationMarker = ({ defaultLocation, onLocationFound }) => {
  const [position, setPosition] = useState(defaultLocation);

  const map = useMapEvents({
    locationfound(e) {
      const location = e.latlng;
      setPosition(location);
      onLocationFound(location);
      map.flyTo(location, 13);
    },
    locationerror() {
      alert("Unable to retrieve your location, using default location.");
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={markerIcons.user}>
      <Popup>Your Location</Popup>
    </Marker>
  );
};

const MapInterface = () => {
  const [markersData, setMarkersData] = useState([]);
  const [userLocation, setUserLocation] = useState({
    lat: 28.63411214313142,
    lng: 77.44750751746051,
  }); // Default location
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [isCreateDriveModalOpen, setIsCreateDriveModalOpen] = useState(false);
  const [isJoinDriveModalOpen, setIsJoinDriveModalOpen] = useState(false);

  // Join Drive Form State
  const [joinDriveForm, setJoinDriveForm] = useState({
    name: "",
    email: "",
    contact: "",
    driveId: "",
  });

  // Create Drive Form State
  const [createDriveForm, setCreateDriveForm] = useState({
    icon: "dustbin",
    location: "",
    date: "",
    objective: "",
    startedBy: localStorage.getItem("username") || "Anonymous",
    abstract: "",
    username: localStorage.getItem("username"),
  });

  useEffect(() => {
    // Fetch markers data from backend or mock data
    const fetchMarkers = async () => {
      try {
        const data = initialMarkersData; // Mock data for now
        setMarkersData(data);
      } catch (error) {
        console.error("Error fetching markers data:", error);
      }
    };
    fetchMarkers();
  }, []);

  const handleLocationFound = (location) => {
    setUserLocation(location);
  };

  const handleJoinClick = (drive) => {
    setSelectedDrive(drive);
    setJoinDriveForm((prev) => ({
      ...prev,
      driveId: drive.id,
    }));
    setIsJoinDriveModalOpen(true);
  };

  const handleJoinDriveSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/joindrive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(joinDriveForm),
      });

      if (response.ok) {
        alert("Successfully joined the drive!");
        setIsJoinDriveModalOpen(false);
        setSelectedDrive(null);
        // Reset form
        setJoinDriveForm({
          name: "",
          email: "",
          contact: "",
          driveId: "",
        });
      } else {
        alert("Failed to join the drive. Please try again.");
      }
    } catch (error) {
      console.error("Error joining drive:", error);
      alert("Failed to join the drive.");
    }
  };

  const handleCreateDriveSubmit = async (e) => {
    e.preventDefault();
    const drivePosition = userLocation
      ? [userLocation.lat, userLocation.lng]
      : [28.5355, 77.391]; // Noida coordinates

    const newDrive = {
      ...createDriveForm,
      id: markersData.length + 1,
      position: drivePosition,
      startedBy: localStorage.getItem("username") || "Anonymous",
      objective:
        createDriveForm.icon === "dustbin"
          ? "Cleanliness Drive"
          : createDriveForm.icon === "tshirt"
          ? "Clothing Donation Drive"
          : "Tree Plantation Drive",
    };

    try {
      const response = await fetch("http://localhost:5000/api/createdrive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDrive),
      });

      if (response.ok) {
        setMarkersData((prev) => [...prev, newDrive]);
        setIsCreateDriveModalOpen(false);
        // Reset form
        setCreateDriveForm({
          icon: "dustbin",
          location: "",
          time: "",
          objective: "",
          startedBy: localStorage.getItem("username") || "Anonymous",
          abstract: "",
        });
        alert("Drive successfully created!");
      } else {
        alert("Failed to create drive. Please try again.");
      }
    } catch (error) {
      console.error("Error creating drive:", error);
      alert("Failed to create the drive.");
    }
  };

  return (
    <div className="w-full h-screen bg-gray-50 overflow-hidden">
      <div className="absolute top-4 right-4 z-50 bg-white shadow-md rounded-lg p-4 mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-green-800">Community Drives</h2>
          <button
            onClick={() => setIsCreateDriveModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors text-sm"
          >
            Create Drive
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Welcome, {localStorage.getItem("username") || "User"}
        </p>
      </div>

      <MapContainer
        center={[28.63411214313142, 77.44750751746051]}
        zoom={13}
        className="w-full h-full z-10"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker
          defaultLocation={{ lat: 28.63411214313142, lng: 77.44750751746051 }}
          onLocationFound={handleLocationFound}
        />
        {markersData.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={markerIcons[marker.icon]}
          >
            <Popup className="custom-popup">
              <div className="p-2">
                <h3 className="text-lg font-bold text-green-800 mb-2">
                  {marker.objective}
                </h3>
                <div className="text-sm space-y-1 mb-3">
                  <p>
                    <strong>Location:</strong> {marker.location}
                  </p>
                  <p>
                    <strong>Time:</strong> {marker.time}
                  </p>
                  <p>
                    <strong>Started By:</strong> {marker.startedBy}
                  </p>
                  <p className="italic text-gray-600">{marker.abstract}</p>
                </div>
                <button
                  onClick={() => handleJoinClick(marker)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Join Drive
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Join Drive Modal */}
      {isJoinDriveModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-full m-4 shadow-xl">
            <h2 className="text-2xl mb-4 text-green-800 font-semibold">
              Join Drive
            </h2>
            <form onSubmit={handleJoinDriveSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={joinDriveForm.name}
                  onChange={(e) =>
                    setJoinDriveForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 transition-all"
                  required
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={joinDriveForm.email}
                  onChange={(e) =>
                    setJoinDriveForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 transition-all"
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={joinDriveForm.contact}
                  onChange={(e) =>
                    setJoinDriveForm((prev) => ({
                      ...prev,
                      contact: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 transition-all"
                  required
                  placeholder="Enter your contact number"
                />
              </div>
              <div className="flex justify-between space-x-4">
                <button
                  type="submit"
                  className="flex-grow bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setIsJoinDriveModalOpen(false)}
                  className="flex-grow bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Drive Modal */}
      {isCreateDriveModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-full m-4 shadow-xl">
            <h2 className="text-2xl mb-4 text-green-800 font-semibold">
              Create New Drive
            </h2>
            <form onSubmit={handleCreateDriveSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Drive Type
                </label>
                <select
                  value={createDriveForm.icon}
                  onChange={(e) =>
                    setCreateDriveForm((prev) => ({
                      ...prev,
                      icon: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 transition-all"
                >
                  <option value="dustbin">Cleanliness Drive</option>
                  <option value="tshirt">Clothing Donation Drive</option>
                  <option value="plant">Tree Plantation Drive</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Location
                </label>
                <input
                  type="text"
                  value={createDriveForm.location}
                  onChange={(e) =>
                    setCreateDriveForm((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 transition-all"
                  required
                  placeholder="Enter drive location"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Date</label>
                <input
                  type="date"
                  value={createDriveForm.date}
                  onChange={(e) =>
                    setCreateDriveForm((prev) => ({
                      ...prev,
                      time: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Abstract
                </label>
                <textarea
                  value={createDriveForm.abstract}
                  onChange={(e) =>
                    setCreateDriveForm((prev) => ({
                      ...prev,
                      abstract: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 transition-all"
                  required
                  placeholder="Provide a brief description of the drive"
                  rows="3"
                />
              </div>
              <div className="flex justify-between space-x-4">
                <button
                  type="submit"
                  className="flex-grow bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  Create Drive
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateDriveModalOpen(false)}
                  className="flex-grow bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapInterface;

// Mock markers data remains the same as in the previous version
const initialMarkersData = [
  {
    id: 1,
    position: [28.5355, 77.391], // Noida
    icon: "dustbin",
    location: "Sector 62, Noida",
    time: "10:00 AM",
    objective: "Cleanliness Drive",
    startedBy: "Noida Residents Welfare",
    abstract:
      "Cleaning up public spaces and raising awareness about waste management.",
  },
  {
    id: 2,
    position: [28.6692, 77.4538], // Ghaziabad
    icon: "tshirt",
    location: "Indirapuram, Ghaziabad",
    time: "12:00 PM",
    objective: "Clothing Donation Drive",
    startedBy: "Youth Community Group",
    abstract: "Collecting gently used clothes for underprivileged families.",
  },
  {
    id: 3,
    position: [28.6817, 77.3637], // Another Ghaziabad location
    icon: "plant",
    location: "Vasundhara, Ghaziabad",
    time: "8:00 AM",
    objective: "Urban Plantation Drive",
    startedBy: "Green NCR Initiative",
    abstract: "Planting trees and creating green spaces in urban areas.",
  },
];
