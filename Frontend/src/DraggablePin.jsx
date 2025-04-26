import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useRef } from "react";

const pinIcon = new L.Icon({
  iconUrl: "https://img.icons8.com/?size=100&id=98957&format=png&color=FF0000",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

export default function DraggablePin({ position, setPinPosition }) {
  const markerRef = useRef();

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const latlng = marker.getLatLng();
        setPinPosition(latlng);
      }
    },
  };

  return (
    <Marker
      draggable
      eventHandlers={eventHandlers}
      position={position}
      icon={pinIcon}
      ref={markerRef}
    >
      <Popup closeButton={false} autoPan={false}>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
          onClick={() => {
            setPinPosition(position, true); // true signals confirmation
          }}
        >
          Pin Location Here
        </button>
      </Popup>
    </Marker>
  );
}
