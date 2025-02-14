import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import "./PlaceAutocomplete.css";
import { useMap } from "@vis.gl/react-google-maps";


export default function PlacesAutocomplete({ setPoint }) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const map = useMap();

  async function handleSelect(address) {
    setValue(address, false);
    clearSuggestions();

    const [result] = await getGeocode({ address });

    const { lat, lng } = getLatLng(result);
    setPoint({ lat, lng });
    map.setCenter({ lat, lng });
    map.setZoom(18);
  }

  return (
    <>
      <div className="combobox_container">
        <input
          type="text"
          className="combobox_input"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
          }
          }
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
