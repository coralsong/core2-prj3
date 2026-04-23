export default function SubmissionForm({
  clickedLatLng,
  form,
  onCancel,
  onChange,
  onSubmit,
}) {
  return (
    <div className={`submissionForm${clickedLatLng ? " active" : ""}`} id="submissionForm">
      <h3>Add</h3>
      <input
        id="storeName"
        type="text"
        placeholder="Store name (e.g. Trader Joes)"
        value={form.storeName}
        onChange={(event) =>
          onChange((current) => ({ ...current, storeName: event.target.value }))
        }
      />
      <input
        id="eggPrice"
        type="number"
        placeholder="Price ($)"
        step="0.01"
        value={form.price}
        onChange={(event) => onChange((current) => ({ ...current, price: event.target.value }))}
      />
      <button id="submitButton" type="button" onClick={onSubmit}>
        Add Pin
      </button>
      <button id="cancelButton" type="button" onClick={onCancel}>
        Cancel
      </button>
      <select
        id="eggType"
        value={form.eggType}
        onChange={(event) => onChange((current) => ({ ...current, eggType: event.target.value }))}
      >
        <option value="brown">Brown Eggs</option>
        <option value="white">White Eggs</option>
        <option value="quail">Quail Eggs</option>
        <option value="ostrich">Ostrich Eggs</option>
        <option value="vegetarian">Vegetarian Eggs</option>
      </select>
    </div>
  );
}
