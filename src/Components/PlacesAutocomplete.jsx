import "./PlaceAutocomplete.css";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";


export default function PlacesAutocomplete({ setFind, setCameraProps }) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  async function handleSelect(address) {
    setValue(address, false);
    clearSuggestions();

    const [result] = await getGeocode({ address });

    const { lat, lng } = getLatLng(result);
    setFind({ lat, lng });
    setCameraProps({
      center: { lat, lng },
      zoom: 18,
    });
  }

  return (
    <>
      <div className="combobox_container">
        <input
          type="text"
          className="combobox_input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          placeholder="Search..."
        />
        <div className="combobox_popover">
          <ul className="combobox_list">
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <li
                  className="combobox_option"
                  key={place_id}
                  onClick={() => handleSelect(description)}
                >
                  {description}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
