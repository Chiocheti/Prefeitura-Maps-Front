import { ComboboxInput, Combobox, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

export default function PlacesAutocomplete({ setFind, setCameraProps }) {

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions
  } = usePlacesAutocomplete();

  async function handleSelect(address) {
    setValue(address, false);
    clearSuggestions();

    const [result] = await getGeocode({ address });

    const { lat, lng } = getLatLng(result);
    setFind({ lat, lng });
    setCameraProps({
      center: { lat, lng },
      zoom: 18
    })
  }

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={!ready}
        placeholder="Search..." />

      <ComboboxPopover>
        <ComboboxList>
          {status === 'OK' && data.map(({ place_id, description }) => <ComboboxOption key={place_id} value={description} />)}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  )
}