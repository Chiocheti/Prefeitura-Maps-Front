import { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import PlacesAutocomplete from "./PlacesAutocomplete";

const libs = ["places"];

export default function Maps02() {
  const [calls, setCalls] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function getData() {
      const list = [
        {
          id: 1,
          lat: -21.965840,
          lng: -46.813547,
          text: "Minha casa",
        },
      ];

      console.log("Atualizando calls:", list);
      setCalls(list);
    }

    setTimeout(getData, 1000);
  }, []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libs,
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <div>
        <PlacesAutocomplete setSelected={setSelected} />
      </div>

      <GoogleMap
        zoom={12}
        center={{ lat: -21.965840, lng: -46.813547 }}
        mapContainerStyle={{ width: "100vw", height: "500px" }}
      >

        {
          calls.map((call) => (
            <Marker key={call.id} position={{ lat: call.lat, lng: call.lng }} />
          ))
        }


        {selected && <Marker position={selected} />}
      </GoogleMap>
    </>
  );
}
