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


function TempMarker({ position, form, onChange, onSubmit, onDismiss }) {
  const markerRef = useRef(null);
  const isSavingRef = useRef(false);

  useEffect(() => {
    markerRef.current?.openPopup();
    isSavingRef.current = false;
  }, [position]);

  function handlePopupClose() {
    if (isSavingRef.current) {
      isSavingRef.current = false;
      return;
    }

    onDismiss();
  }

async function handleSaveStore() {
  try {
    isSavingRef.current = true;
    await onSubmit();
    console.log("Store saved");
  } catch (error) {
    console.error("Save Store failed:", error);
    window.alert("Saving store failed. Check the console.");
    isSavingRef.current = false;
  }
}

  return (
    <Marker
      position={position}
      icon={customIcon}
      ref={markerRef}
      eventHandlers={{
        popupclose: handlePopupClose,
      }}
    >
      <Popup>
        <div className="mini-pin-form">
          <p>Add a store</p>

          <input
            type="text"
            placeholder="New store name"
            value={form.storeName}
            onChange={(event) =>
              onChange((current) => ({ ...current, storeName: event.target.value }))
            }
          />

          <button type="button" onClick={handleSaveStore}>Save Store</button>
        </div>
      </Popup>
    </Marker>
  );
}

function StoreMarker({ store, form, onFormChange, onAddEggInfo, onPinSelect }) {
  const hasEntries = store.pins.some((pin) => typeof pin.price === "number" && pin.eggType);

  return (
    <Marker
      position={[store.latitude, store.longitude]}
      icon={customIcon}
      eventHandlers={{
        click: () => onPinSelect(store),
      }}
    >
      <Popup>
        <div className="mini-pin-form">
          <p>{store.storeName}</p>
          {/* {hasEntries ? (
            <div className="mini-pin-list">
              {store.pins
                .filter((pin) => typeof pin.price === "number" && pin.eggType)
                .map((pin) => (
                  <div key={pin._id} className="mini-pin-list-row">
                    <span>{pin.eggType}</span>
                    <span>${pin.price.toFixed(2)}</span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="mini-pin-empty">No egg prices yet.</div>
          )} */}

          <select
            value={form.eggType}
            onChange={(event) =>
              onFormChange((current) => ({ ...current, eggType: event.target.value }))
            }
          >
            <option value="brown">Brown Eggs</option>
            <option value="white">White Eggs</option>
            <option value="quail">Quail Eggs</option>
            <option value="ostrich">Ostrich Eggs</option>
            <option value="vegetarian">Vegetarian Eggs</option>
          </select>

          <input
            type="number"
            placeholder="Price ($)"
            step="0.1"
            value={form.storeName === store.storeName ? form.price : ""}
            onChange={(event) =>
              onFormChange((current) => ({
                ...current,
                storeName: store.storeName,
                price: event.target.value,
              }))
            }
          />

          <button type="button" onClick={() => onAddEggInfo(store)}>
            Add Egg Info
          </button>
        </div>
      </Popup>
    </Marker>
  );
}

export default function EggMap({
  pins,
  onMapClick,
  clickedPosition,
  onPinSelect,
  form,
  onFormChange,
  onCreateStore,
  onAddEggInfo,
  onDismissTempMarker,
}) {
  const storeMap = new Map();

  for (const pin of pins) {
    const key = pin.storeName.trim();
    if (!storeMap.has(key)) {
      storeMap.set(key, {
        storeName: key,
        latitude: pin.latitude,
        longitude: pin.longitude,
        pins: [],
      });
    }

    storeMap.get(key).pins.push(pin);
  }

  const stores = Array.from(storeMap.values());

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

      {clickedPosition && (
        <TempMarker
          position={[clickedPosition.lat, clickedPosition.lng]}
          form={form}
          onChange={onFormChange}
          onSubmit={onCreateStore}
          onDismiss={onDismissTempMarker}
        />
      )}

      {stores.map((store) => (
        <StoreMarker
          key={store.storeName}
          store={store}
          form={form}
          onFormChange={onFormChange}
          onAddEggInfo={onAddEggInfo}
          onPinSelect={onPinSelect}
        />
      ))}
    </MapContainer>
  );
}
