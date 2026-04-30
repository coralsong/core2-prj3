import { useEffect, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import "../leafletIcons";
import { DEFAULT_CENTER, MAP_BOUNDS } from "../constants";

import L from "leaflet";
import myPin from "../../assets/egg.png";



function MapClickCapture({ onMapClick }) {
  useMapEvents({
    click(event) {
      onMapClick(event.latlng);
    },
  });

  return null;
}

const customIcon = L.icon({
  iconUrl: myPin,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
  className: "egg-marker",
});


function TempMarker({ position }) {
  const markerRef = useRef(null);

  useEffect(() => {
    markerRef.current?.openPopup();
  }, [position]);

  return (
    <Marker position={position} icon={customIcon} ref={markerRef}>
      <Popup>
          <div className="mini-pin-form">
          <p>Add a pin</p>
          <input type="text" placeholder="Store name" />
          <input type="number" placeholder="Price ($)" step="0.01" />
          <button id="submitButton" type="button" onClick={onSubmit}>Save</button>
          <button id="cancelButton" type="button" onClick={onCancel}>Cancel</button>
  </div>
      </Popup>
    </Marker>
  );
}


export default function EggMap({ pins, onMapClick, clickedPosition, onPinSelect }) {
  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={15}
      minZoom={13.5}
      maxZoom={19}
      maxBounds={MAP_BOUNDS}
      maxBoundsViscosity={1}
      scrollWheelZoom
      className="leaflet-map"
    >
      <TileLayer
        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickCapture onMapClick={onMapClick} />

      {/* added temp pins for better comp */}
      {clickedPosition && (
        <TempMarker position={[clickedPosition.lat, clickedPosition.lng]} />
      )}

      {pins.map((pin) => (
        <Marker key={pin._id} position={[pin.latitude, pin.longitude]} icon={customIcon}>
          <Popup>
            <div>
              <button
                type="button"
                className="store-link"
                onClick={() => onPinSelect(pin)}
              >
                <b>{pin.storeName}</b>
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
