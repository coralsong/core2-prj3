import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "./convexApi";
import Header from "./components/Header";
import EggMap from "./components/EggMap";
import "./index.css";

const DEFAULT_FORM = {
  eggType: "brown",
  price: "",
  storeName: "",
};

const LOCATION_TOLERANCE = 0.00002;

function AppShell({ pins, onCreatePin }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [selectedStoreName, setSelectedStoreName] = useState("");

  const storeGroups = [];
  const storeGroupMap = new Map();

  for (const pin of pins) {
    const key = pin.storeName.trim();
    if (!storeGroupMap.has(key)) {
      const group = {
        storeName: key,
        latitude: pin.latitude,
        longitude: pin.longitude,
        pins: [],
      };
      storeGroupMap.set(key, group);
      storeGroups.push(group);
    }

    storeGroupMap.get(key).pins.push(pin);
  }

  const selectedStore =
    storeGroupMap.get(selectedStoreName) ??
    storeGroups[0] ??
    null;

  async function handleSubmit() {
    const storeName = form.storeName.trim();
    const storeExists = storeGroups.some(
      (group) => group.storeName.toLowerCase() === storeName.toLowerCase(),
    );

    if (!storeName) {
      window.alert("Please enter a store name.");
      return;
    }

    if (storeExists) {
      window.alert("That store already exists. Click its marker to add egg info.");
      return;
    }

    if (!clickedLatLng) {
      window.alert("Please click the map first.");
      return;
    }

    await onCreatePin({
      storeName,
      latitude: clickedLatLng.lat,
      longitude: clickedLatLng.lng,
    });

    setSelectedStoreName(storeName);
    setForm(DEFAULT_FORM);
    setClickedLatLng(null);
  }

  async function handleAddEggInfo(store) {
    const storeName = store.storeName;
    const eggPrice = form.price.trim();

    if (!eggPrice) {
      window.alert("Please fill in the egg price.");
      return;
    }

    await onCreatePin({
      eggType: form.eggType,
      latitude: store.latitude,
      longitude: store.longitude,
      price: Number(eggPrice),
      storeName,
    });

    setSelectedStoreName(storeName);
    setForm((current) => ({
      ...current,
      eggType: DEFAULT_FORM.eggType,
      price: "",
      storeName,
    }));
  }

  function handleCancel() {
    setForm(DEFAULT_FORM);
    setClickedLatLng(null);
  }

  function handleMapClick(latlng) {
    const existingStore = storeGroups.find(
      (group) =>
        Math.abs(group.latitude - latlng.lat) < LOCATION_TOLERANCE &&
        Math.abs(group.longitude - latlng.lng) < LOCATION_TOLERANCE,
    );

    if (existingStore) {
      handlePinSelect(existingStore);
      return;
    }

    setClickedLatLng(latlng);
    setSelectedStoreName("");
    setForm(DEFAULT_FORM);
  }

  function handleTempMarkerDismiss() {
    setClickedLatLng(null);
    setForm(DEFAULT_FORM);
  }

  function handlePinSelect(pin) {
    setSelectedStoreName(pin.storeName);
    setClickedLatLng(null);
    setForm((current) => ({
      ...current,
      storeName: pin.storeName,
      eggType: DEFAULT_FORM.eggType,
      price: "",
    }));
  }

  return (
    <>
      <Header />
        <div className="main">

      <div className="main-left">
        <div id="filter">
       <button className="filter-btn active" type="button">Show all</button>
       <button className="filter-btn" type="button">Brown Eggs</button>
       <button className="filter-btn" type="button">White Eggs</button>
       <button className="filter-btn" type="button">Quail Eggs</button>
       <button className="filter-btn" type="button">Ostrich Eggs</button>
       <button className="filter-btn" type="button">Plant-Based Eggs</button>
      </div>

      <div className="storeName">
        <div id="storeName-1">
          <p><strong>Stores</strong></p>
        </div>

        {storeGroups.length > 0 ? (
          <>
            <div className="store-list">
              {storeGroups.map((group) => (
                <button
                  key={group.storeName}
                  type="button"
                  className={`store-list-item${
                    selectedStore?.storeName === group.storeName ? " active" : ""
                  }`}
                  onClick={() => setSelectedStoreName(group.storeName)}
                >
                  {group.storeName}
                </button>
              ))}
            </div>

            {selectedStore && (
              <div id="storeInfo">
                <p className="store-info-title">
                  <strong>{selectedStore.storeName}</strong>
                </p>
                {selectedStore.pins.some((pin) => typeof pin.price === "number" && pin.eggType) ? (
                  selectedStore.pins
                    .filter((pin) => typeof pin.price === "number" && pin.eggType)
                    .map((pin) => (
                      <div key={pin._id} className="store-egg-row">
                        <p>{pin.eggType}</p>
                        <p>${pin.price.toFixed(2)}</p>
                      </div>
                    ))
                ) : (
                  <p>No egg prices added for this store yet.</p>
                )}
              </div>
            )}
          </>
        ) : (
          <div id="storeInfo">
            <p>No stores added yet.</p>
          </div>
        )}
      </div>
      </div>

      <div className="map">
        <div id="map">
          <EggMap
            pins={pins}
            onMapClick={handleMapClick}
            clickedPosition={clickedLatLng}
            onPinSelect={handlePinSelect}
            form={form}
            onFormChange={setForm}
            onCreateStore={handleSubmit}
            onAddEggInfo={handleAddEggInfo}
            onDismissTempMarker={handleTempMarkerDismiss}
          />
        </div>
      </div>


      </div>

      
    </>
  );
}

function ConvexApp() {
  const pins = useQuery(api.eggPrices.list, {}) ?? [];
  const createPin = useMutation(api.eggPrices.create);
  const createStore = useMutation(api.eggPrices.createStore);

  async function handleCreatePin(pin) {
    if ("eggType" in pin) {
      await createPin(pin);
      return;
    }

    await createStore(pin);
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
