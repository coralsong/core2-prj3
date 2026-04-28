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
});

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
        <Marker position={[clickedPosition.lat, clickedPosition.lng]} icon={customIcon}>
          <Popup>Type and add your pin here</Popup>
        </Marker>
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
