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
      <Header />

      <div className="map">
        <div id="map">
          <EggMap pins={pins} onMapClick={setClickedLatLng} clickedPosition={clickedLatLng} />
        </div>
      </div>

      <SubmissionForm
        clickedLatLng={clickedLatLng}
        form={form}
        onCancel={handleCancel}
        onChange={setForm}
        onSubmit={handleSubmit}
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
