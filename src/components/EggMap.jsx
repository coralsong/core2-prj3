import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import "../leafletIcons";
import { DEFAULT_CENTER, MAP_BOUNDS } from "../constants";

function MapClickCapture({ onMapClick }) {
  useMapEvents({
    click(event) {
      onMapClick(event.latlng);
    },
  });

  return null;
}

export default function EggMap({ pins, onMapClick }) {
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

      {pins.map((pin) => (
        <Marker key={pin._id} position={[pin.latitude, pin.longitude]}>
          <Popup>
            <div>
              <b>{pin.storeName}</b>
              <br />
              Eggs: ${pin.price.toFixed(2)} per dozen
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
