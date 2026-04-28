import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "./convexApi";
import Header from "./components/Header";
import EggMap from "./components/EggMap";
import SubmissionForm from "./components/SubmissionForm";
import "./index.css";

const DEFAULT_FORM = {
  eggType: "brown",
  price: "",
  storeName: "",
};

function AppShell({ pins, onCreatePin }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);

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
    setSelectedPin(null);
  }

  function handleMapClick(latlng) {
    setClickedLatLng(latlng);
    setSelectedPin(null);
  }

  function handlePinSelect(pin) {
    setSelectedPin(pin);
    setClickedLatLng(null);
  }

  return (
    <>
      <Header />
        <div className="main">

      <div className="main-left">
        <div id="filter">
        <button className="filter-btn active" onClick={() => filterSelection('all')}>Show all</button>
        <button className="filter-btn" onClick={() => filterSelection('brown')}>Brown Eggs</button>
        <button className="filter-btn" onClick={() => filterSelection('white')}>White Eggs</button>
        <button className="filter-btn" onClick={() => filterSelection('quail')}>Quail Eggs </button>
        <button className="filter-btn" onClick={() => filterSelection('ostrich')}>Ostrich Eggs</button>
        <button className="filter-btn" onClick={() => filterSelection('plant-based')}>Plant-Based Eggs</button>
      </div>

      {selectedPin && (
        <div className="storeName">
          <p><strong>{selectedPin.storeName}</strong></p>
          <p>Price: ${selectedPin.price.toFixed(2)}</p>
          <p>Type: {selectedPin.eggType}</p>
          <p>Latitude: {selectedPin.latitude.toFixed(4)}</p>
          <p>Longitude: {selectedPin.longitude.toFixed(4)}</p>
        </div>
      )}
      </div>

      <div className="map">
        <div id="map">
          <EggMap
            pins={pins}
            onMapClick={handleMapClick}
            clickedPosition={clickedLatLng}
            onPinSelect={handlePinSelect}
          />
        </div>
      </div>


      </div>

      <SubmissionForm
        clickedLatLng={clickedLatLng}
        form={form}
        onCancel={handleCancel}
        onChange={setForm}
        onSubmit={handleSubmit}
        selectedPin={selectedPin}
      />
    </>
  );
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
