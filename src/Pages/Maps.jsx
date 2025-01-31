import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  ControlPosition,
} from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import PlacesAutocomplete from "../Components/PlacesAutocomplete";
import CreateCall from "../Components/CreateCall";
import { api } from "../services/api";
import moment from "moment";
import "../Components/CreateCall.css";
import "./InfoWindow.css";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = import.meta.env.VITE_PUBLIC_MAP_ID;

const LIBS = ["places"];

const INITIAL_CAMERA = {
  center: { lat: -21.985837, lng: -46.792604 },
  zoom: 15,
};

const oneWeek = moment().subtract(7, "days");
const oneMonth = moment().subtract(1, "months");
export default function Maps() {
  const [calls, setCalls] = useState([]);
  const [find, setFind] = useState(null);
  const [selected, setSelected] = useState(null);
  const [cameraProps, setCameraProps] = useState(INITIAL_CAMERA);

  const handleCameraChange = useCallback((ev) => {
    setCameraProps(ev.detail);
  });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBS,
  });

  useEffect(() => {
    async function getData() {
      try {
        const { data } = await api.get("/calls/getAll");
        console.log("Atualizando calls:", data);
        setCalls(data);
      } catch (error) {
        console.log(error);
      }
    }

    setTimeout(getData, 1000);
  }, []);

  async function findCalls(newCenter) {
    try {
      const { data } = await api.get("/calls/getAll");
      console.log("Atualizando calls:", data);
      setCalls(data);
      setFind();
      setCameraProps({
        center: newCenter,
        zoom: 18,
      });
    } catch (error) {
      console.log(error);
    }
  }

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex" }}>
      {find && (
        <div className="create_call_wrapper">
          <CreateCall find={find} findCalls={findCalls} />
        </div>
      )}

      <div style={{ width: find ? "85vw" : "100vw", height: "100vh" }}>
        <APIProvider apiKey={API_KEY}>
          <div>
            <PlacesAutocomplete
              setFind={setFind}
              setCameraProps={setCameraProps}
            ></PlacesAutocomplete>
          </div>

          <Map
          
            mapTypeControlOptions={{
              position: ControlPosition.INLINE_END_BLOCK_START,
            }}
            mapId={MAP_ID}
            {...cameraProps}
            onCameraChanged={handleCameraChange}
            // colorScheme="DARK" // 'LIGHT' | 'DARK'
            style={{
              width: "100%",
              height: "100%",
            }}
            styles={[
              {
                featureType: "poi",
                elementType: "all",
                stylers: [{ visibility: "off" }],
              },
            ]}
          >
            {calls.map((call) => (
              <AdvancedMarker
                key={call.id}
                position={{ lat: call.lat, lng: call.lng }}
                onClick={() => setSelected(call)}
              >
                <Pin
                  borderColor={"none"}

                  background={(function () {
                    switch (call.service) {
                      case "Corte de Arvore":
                        return "rgb(0, 114, 55)";
                      case "Calçada quebrada":
                        return "rgb(76, 75, 75)";
                      case "Mato alto":
                        return "rgb(41, 171, 135)";
                      case "Afiação":
                        return "rgb(254, 220, 86)";
                      case "Asfalto":
                        return "rgb(155, 30, 44)";

                      default:
                        break;
                    }
                  })()}
                  glyphColor={(function () {
                    switch (call.service) {
                      case "Corte de Arvore":
                        return "rgb(1, 68, 33)";
                      case "Calçada quebrada":
                        return "rgb(26, 26, 26)";
                      case "Mato alto":
                        return "rgb(33, 139, 109)";
                      case "Afiação":
                        return "rgb(218, 188, 72)";
                      case "Asfalto":
                        return "rgb(101, 0, 11)";

                      default:
                        break;
                    }
                  })()}
                ></Pin>
              </AdvancedMarker>
            ))}

            {find && (
              <AdvancedMarker position={{ lat: find.lat, lng: find.lng }}>
                <Pin />
              </AdvancedMarker>
            )}

            {selected && (
              <InfoWindow
                position={{ lat: selected.lat, lng: selected.lng }}
                onCloseClick={() => setSelected(null)}
              >
                <div className="info_window">
                  <p>Tipo: {selected.service}</p>
                  <p>Prioridade: {selected.priority}</p>
                  <p>Dia Criado: {moment(selected.date).format('DD/MM/YYYY')}</p>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
