import {
  ComboboxInput,
  Combobox,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

import './PlaceAutocomplete.css'
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
      <Combobox onSelect={handleSelect} className='combobox_container'>
        <ComboboxInput
          className="combobox_input"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
          }
          }
          disabled={!ready}
          placeholder="Search..."
        />

        <ComboboxPopover className="combobox_popover">
          <ComboboxList className="combobox_list">
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption className="combobox_option" key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </>
  );
}
