import { useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { useMutation, useQuery } from "convex/react";
import "./index.css";
import "./leafletIcons";
import { api } from "./convexApi";
import { DEFAULT_CENTER, MAP_BOUNDS } from "./constants";

const DEFAULT_FORM = {
  eggType: "brown",
  price: "",
  storeName: "",
};

function AppShell({ pins, onCreatePin }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [clickedLatLng, setClickedLatLng] = useState(null);

  const markerPins = useMemo(
    () =>
      pins.map((pin) => ({
        id: pin._id,
        latitude: pin.latitude,
        longitude: pin.longitude,
        price: pin.price,
        storeName: pin.storeName,
      })),
    [pins],
  );

  async function handleSubmit() {
    const storeName = form.storeName.trim();
    const eggPrice = form.price.trim();

    if (!storeName || !eggPrice) {
      window.alert("Please fill in both the store name and price.");
      return;
    }

    if (!clickedLatLng) {
      window.alert("Please click the map first.");
      return;
    }

    await onCreatePin({
      eggType: form.eggType,
      latitude: clickedLatLng.lat,
      longitude: clickedLatLng.lng,
      price: Number(eggPrice),
      storeName,
    });

    setForm(DEFAULT_FORM);
    setClickedLatLng(null);
  }

  function handleCancel() {
    setForm(DEFAULT_FORM);
    setClickedLatLng(null);
  }

  return (
    <>
      <div className="header">
        <h1>
          <a href="../EGGxpert">EGGxpert</a>
        </h1>
        <nav>
          <span>Brown Eggs</span>
          <span>White Eggs</span>
          <span>Quail Eggs</span>
          <span>Ostrich Eggs</span>
          <span>Vegetarian Eggs</span>
        </nav>
      </div>

      <div className="map">
        <div id="map">
          <EggMap pins={markerPins} onMapClick={setClickedLatLng} />
        </div>
      </div>

      <div className={`submissionForm${clickedLatLng ? " active" : ""}`} id="submissionForm">
        <h3>Add</h3>
        <input
          id="storeName"
          type="text"
          placeholder="Store name (e.g. Trader Joes)"
          value={form.storeName}
          onChange={(event) =>
            setForm((current) => ({ ...current, storeName: event.target.value }))
          }
        />
        <input
          id="eggPrice"
          type="number"
          placeholder="Price ($)"
          step="0.01"
          value={form.price}
          onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
        />
        <button id="submitButton" type="button" onClick={handleSubmit}>
          Add Pin
        </button>
        <button id="cancelButton" type="button" onClick={handleCancel}>
          Cancel
        </button>
        <select
          id="eggType"
          value={form.eggType}
          onChange={(event) => setForm((current) => ({ ...current, eggType: event.target.value }))}
        >
          <option value="brown">Brown Eggs</option>
          <option value="white">White Eggs</option>
          <option value="quail">Quail Eggs</option>
          <option value="ostrich">Ostrich Eggs</option>
          <option value="vegetarian">Vegetarian Eggs</option>
        </select>
      </div>
    </>
  );
}

function EggMap({ pins, onMapClick }) {
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
        <Marker key={pin.id} position={[pin.latitude, pin.longitude]}>
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

function MapClickCapture({ onMapClick }) {
  useMapEvents({
    click(event) {
      onMapClick(event.latlng);
    },
  });

  return null;
}

function ConvexApp() {
  const pins = useQuery(api.eggPrices.list, {}) ?? [];
  const createPin = useMutation(api.eggPrices.create);

  async function handleCreatePin(pin) {
    await createPin(pin);
  }

  return <AppShell pins={pins} onCreatePin={handleCreatePin} />;
}

function LocalApp() {
  const [pins, setPins] = useState([]);

  async function handleCreatePin(pin) {
    setPins((current) => [
      ...current,
      {
        _id: `local-${Date.now()}`,
        ...pin,
      },
    ]);
  }

  return <AppShell pins={pins} onCreatePin={handleCreatePin} />;
}

export default function App({ convexReady }) {
  return convexReady ? <ConvexApp /> : <LocalApp />;
}
