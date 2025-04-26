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
import DraggablePin from "./DraggablePin";
import {
  MapPin,
  Calendar,
  Clock,
  User,
  Send,
  Trash,
  PlusCircle,
  Users,
  Layers,
  Trash2,
  Info,
  Map,
  Navigation,
  Crosshair,
} from "lucide-react";

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
      <Popup className="custom-popup">
        <div className="p-2 text-center">
          <span className="font-medium text-green-700">Your Location</span>
        </div>
      </Popup>
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
  const [isSettingLocation, setIsSettingLocation] = useState(false);
  const [tempPinPosition, setTempPinPosition] = useState(null);
  const [filteredIcon, setFilteredIcon] = useState("all");

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
    time: "",
    objective: "",
    startedBy: localStorage.getItem("username") || "Anonymous",
    abstract: "",
    username: localStorage.getItem("username"),
    position: null, // <-- New field for latlng
  });

  useEffect(() => {
    // Fetch markers data from backend or mock data
    const fetchMarkers = async () => {
      try {
        // Try to load from localStorage first
        const stored = localStorage.getItem("markersData");
        let data = initialMarkersData;
        if (stored) {
          try {
            data = JSON.parse(stored);
          } catch (err) {
            data = initialMarkersData;
          }
        }
        setMarkersData(data);
        localStorage.setItem("markersData", JSON.stringify(data));
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

  const saveJoinedDrive = (drive, user) => {
    const stored = localStorage.getItem("joinedDrives");
    let joined = [];
    if (stored) {
      try {
        joined = JSON.parse(stored);
      } catch {
        joined = [];
      }
    }
    // Avoid duplicate join
    if (!joined.find((j) => j.id === drive.id && j.username === user)) {
      joined.push({ ...drive, username: user });
      localStorage.setItem("joinedDrives", JSON.stringify(joined));
    }
  };

  const handleJoinDriveSubmit = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem("username") || "Anonymous";
    // MOCK join: save in localStorage
    if (selectedDrive) {
      saveJoinedDrive(selectedDrive, user);
      alert("Successfully joined the drive! (mock)");
      setIsJoinDriveModalOpen(false);
      setSelectedDrive(null);
      setJoinDriveForm({
        name: "",
        email: "",
        contact: "",
        driveId: "",
      });
      return;
    }
    // --- REAL API CODE BELOW (unchanged, but will not run due to early return) ---
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
      id: Date.now(), // Ensures unique key
      position: createDriveForm.position || drivePosition,
      startedBy: localStorage.getItem("username") || "Anonymous",
      objective:
        createDriveForm.icon === "dustbin"
          ? "Cleanliness Drive"
          : createDriveForm.icon === "tshirt"
          ? "Clothing Donation Drive"
          : "Tree Plantation Drive",
    };

    // Add to mock array
    let updated;
    setMarkersData((prev) => {
      updated = [...prev, newDrive];
      localStorage.setItem("markersData", JSON.stringify(updated));
      return updated;
    });
    setIsCreateDriveModalOpen(false);
    // Reset form
    setCreateDriveForm({
      icon: "dustbin",
      location: "",
      date: "",
      time: "",
      objective: "",
      startedBy: localStorage.getItem("username") || "Anonymous",
      abstract: "",
      position: null,
    });

    // Show success toast instead of alert
    const successToast = document.createElement("div");
    successToast.className =
      "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in flex items-center";
    successToast.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      Drive successfully created!
    `;
    document.body.appendChild(successToast);
    setTimeout(() => {
      successToast.classList.add("animate-fade-out");
      setTimeout(() => document.body.removeChild(successToast), 500);
    }, 3000);
  };

  const filteredMarkers =
    filteredIcon === "all"
      ? markersData
      : markersData.filter((marker) => marker.icon === filteredIcon);

  return (
    <div className="w-full h-screen bg-gray-50 overflow-hidden relative">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md px-4 py-3 z-20 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-green-500 rounded-full p-1">
            <Map className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-green-600">EcoDrive Map</span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="hidden md:inline-block text-sm text-gray-700">
            Welcome, {localStorage.getItem("username") || "User"}
          </span>
          <div className="bg-green-100 rounded-full p-1">
            <User className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>

      {/* Side Control Panel */}
      <div className="fixed top-16 left-4 z-20 bg-white shadow-lg rounded-xl overflow-hidden max-w-xs w-64 transition-all duration-300">
        <div className="p-4 bg-gradient-to-r from-green-500 to-green-600">
          <h2 className="text-lg font-bold text-white flex items-center">
            <Layers className="w-5 h-5 mr-2" />
            Community Drives
          </h2>
        </div>

        <div className="p-4 space-y-4">
          {/* Filter Control */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">
              Filter by type:
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilteredIcon("all")}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filteredIcon === "all"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilteredIcon("dustbin")}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filteredIcon === "dustbin"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Cleanliness
              </button>
              <button
                onClick={() => setFilteredIcon("tshirt")}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filteredIcon === "tshirt"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Clothing
              </button>
              <button
                onClick={() => setFilteredIcon("plant")}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filteredIcon === "plant"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Plantation
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700">
                Active Drives:
              </h3>
              <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                {filteredMarkers.length}
              </span>
            </div>

            <div className="text-xs text-gray-500">
              Click on a marker to view drive details
            </div>
          </div>

          <button
            onClick={() => setIsCreateDriveModalOpen(true)}
            className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Drive</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <MapContainer
        center={[28.63411214313142, 77.44750751746051]}
        zoom={13}
        className="w-full h-full z-10"
        style={{ height: "100vh" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <LocationMarker
          defaultLocation={{ lat: 28.63411214313142, lng: 77.44750751746051 }}
          onLocationFound={handleLocationFound}
        />

        {isSettingLocation && (
          <DraggablePin
            position={tempPinPosition || userLocation}
            setPinPosition={(latlng, confirm) => {
              if (confirm) {
                setCreateDriveForm((prev) => ({
                  ...prev,
                  position: [latlng.lat, latlng.lng],
                }));
                setIsSettingLocation(false);
              } else {
                setTempPinPosition(latlng);
              }
            }}
          />
        )}

        {filteredMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={markerIcons[marker.icon]}
          >
            <Popup className="custom-popup">
              <div className="p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <div
                    className={`p-1 rounded-full ${
                      marker.icon === "dustbin"
                        ? "bg-blue-100"
                        : marker.icon === "tshirt"
                        ? "bg-purple-100"
                        : "bg-green-100"
                    }`}
                  >
                    {marker.icon === "dustbin" ? (
                      <Trash2 className="w-4 h-4 text-blue-600" />
                    ) : marker.icon === "tshirt" ? (
                      <Users className="w-4 h-4 text-purple-600" />
                    ) : (
                      <Info className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {marker.objective}
                  </h3>
                </div>

                <div className="text-sm space-y-2 mb-3 bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{marker.location}</p>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                    <p className="text-gray-700">{marker.date}</p>
                  </div>

                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                    <p className="text-gray-700">{marker.time}</p>
                  </div>

                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                    <p className="text-gray-700">{marker.startedBy}</p>
                  </div>
                </div>

                <p className="italic text-gray-600 text-sm bg-gray-50 p-2 rounded-lg mb-3">
                  {marker.abstract}
                </p>

                <button
                  onClick={() => handleJoinClick(marker)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Join Drive</span>
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Action Button - My Location */}
      <button
        className="fixed bottom-6 right-6 bg-white p-3 rounded-full shadow-lg z-20 hover:bg-gray-100 transition-colors"
        onClick={() => {
          // This would be implemented to center the map on user location
          // But we'll leave it as visual only for now
        }}
      >
        <Navigation className="w-6 h-6 text-green-600" />
      </button>

      {/* Join Drive Modal */}
      {isJoinDriveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl w-96 max-w-full m-4 shadow-2xl animate-fade-in">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                Join Drive
              </h2>
              <p className="text-sm text-gray-500">
                {selectedDrive?.objective} on {selectedDrive?.date}
              </p>
            </div>

            <form onSubmit={handleJoinDriveSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={joinDriveForm.name}
                  onChange={(e) =>
                    setJoinDriveForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                  required
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={joinDriveForm.email}
                  onChange={(e) =>
                    setJoinDriveForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
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
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                  required
                  placeholder="Enter your contact number"
                />
              </div>

              <div className="flex justify-between space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsJoinDriveModalOpen(false)}
                  className="flex-grow bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-grow bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Drive Modal */}
      {isCreateDriveModalOpen && !isSettingLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md m-4 shadow-2xl animate-fade-in overflow-y-auto max-h-[90vh]">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                Create New Drive
              </h2>
              <p className="text-sm text-gray-500">
                Help organize community environmental efforts
              </p>
            </div>

            <form onSubmit={handleCreateDriveSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Drive Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCreateDriveForm((prev) => ({
                        ...prev,
                        icon: "dustbin",
                      }))
                    }
                    className={`p-2 border rounded-lg flex flex-col items-center justify-center text-xs ${
                      createDriveForm.icon === "dustbin"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <Trash2
                      className={`w-5 h-5 mb-1 ${
                        createDriveForm.icon === "dustbin"
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                    />
                    <span>Cleanliness</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCreateDriveForm((prev) => ({
                        ...prev,
                        icon: "tshirt",
                      }))
                    }
                    className={`p-2 border rounded-lg flex flex-col items-center justify-center text-xs ${
                      createDriveForm.icon === "tshirt"
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <Users
                      className={`w-5 h-5 mb-1 ${
                        createDriveForm.icon === "tshirt"
                          ? "text-purple-500"
                          : "text-gray-400"
                      }`}
                    />
                    <span>Clothing</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCreateDriveForm((prev) => ({ ...prev, icon: "plant" }))
                    }
                    className={`p-2 border rounded-lg flex flex-col items-center justify-center text-xs ${
                      createDriveForm.icon === "plant"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <Info
                      className={`w-5 h-5 mb-1 ${
                        createDriveForm.icon === "plant"
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                    />
                    <span>Plantation</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
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
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                  required
                  placeholder="Enter drive location"
                />

                <button
                  type="button"
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-1"
                  onClick={() => {
                    setIsSettingLocation(true);
                    setTempPinPosition(userLocation);
                    setIsCreateDriveModalOpen(false);
                  }}
                >
                  <Crosshair className="w-4 h-4" />
                  <span>Set Location on Map</span>
                </button>

                {createDriveForm.position && (
                  <div className="mt-2 text-xs bg-green-50 text-green-700 p-2 rounded-lg flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>
                      Location set: Lat {createDriveForm.position[0].toFixed(5)}
                      , Lng {createDriveForm.position[1].toFixed(5)}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    value={createDriveForm.date}
                    onChange={(e) =>
                      setCreateDriveForm((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Time
                  </label>
                  <input
                    type="time"
                    value={createDriveForm.time}
                    onChange={(e) =>
                      setCreateDriveForm((prev) => ({
                        ...prev,
                        time: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={createDriveForm.abstract}
                  onChange={(e) =>
                    setCreateDriveForm((prev) => ({
                      ...prev,
                      abstract: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                  required
                  placeholder="Provide a brief description of the drive"
                  rows="3"
                />
              </div>

              <div className="flex justify-between space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateDriveModalOpen(false)}
                  className="flex-grow bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-grow bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Drive</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pin Placement UI - shown when setting location on map */}
      {isSettingLocation && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-4 py-3 rounded-lg shadow-lg z-30 w-72 text-center">
          <h3 className="font-medium text-gray-800 mb-2">Set Drive Location</h3>
          <p className="text-sm text-gray-600 mb-3">
            Drag the pin to your desired location
          </p>
          <div className="flex justify-between space-x-3">
            <button
              className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              onClick={() => {
                setIsSettingLocation(false);
                setIsCreateDriveModalOpen(true);
              }}
            >
              Cancel
            </button>
            <button
              className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
              onClick={() => {
                // We'll use the current tempPinPosition to finalize the location
                if (tempPinPosition) {
                  setCreateDriveForm((prev) => ({
                    ...prev,
                    position: [tempPinPosition.lat, tempPinPosition.lng],
                  }));
                }
                setIsSettingLocation(false);
                setIsCreateDriveModalOpen(true);
              }}
            >
              Confirm Location
            </button>
          </div>
        </div>
      )}

      {/* Initial mock data */}
    </div>
  );
};

// Sample marker data
const initialMarkersData = [
  {
    id: 1,
    icon: "dustbin",
    position: [28.6352, 77.2217], // New Delhi
    location: "Connaught Place, New Delhi",
    date: "2025-05-15",
    time: "09:00",
    objective: "Cleanliness Drive",
    startedBy: "EcoClub Delhi",
    abstract:
      "Join us for a community cleanliness drive to clean up the streets around Connaught Place. Bring gloves and water.",
  },
  {
    id: 2,
    icon: "tshirt",
    position: [28.5355, 77.391], // Noida
    location: "Sector 18, Noida",
    date: "2025-05-22",
    time: "14:00",
    objective: "Clothing Donation Drive",
    startedBy: "Help Foundation",
    abstract:
      "Donate your unused clothes to those in need. Collection point at Sector 18 market.",
  },
  {
    id: 3,
    icon: "plant",
    position: [28.4595, 77.0266], // Gurugram
    location: "Biodiversity Park, Gurugram",
    date: "2025-05-30",
    time: "07:30",
    objective: "Tree Plantation Drive",
    startedBy: "Green Earth Society",
    abstract:
      "Let's make Gurugram greener! Our target is to plant 500 native tree species in the biodiversity park.",
  },
];

export default MapInterface;
