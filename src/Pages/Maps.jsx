import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import PlacesAutocomplete from '../Components/PlacesAutocomplete'
import CreateCall from "../Components/CreateCall";
import { api } from "../services/api";
import moment from "moment";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = import.meta.env.VITE_PUBLIC_MAP_ID;

const LIBS = ["places"];

const INITIAL_CAMERA = {
  center: { lat: -21.985837, lng: -46.792604 },
  zoom: 15
};

const oneWeek = moment().subtract(7, 'days');
const oneMonth = moment().subtract(1, 'months');
export default function Maps() {
  const [calls, setCalls] = useState([]);
  const [find, setFind] = useState(null);
  const [selected, setSelected] = useState(null);
  const [cameraProps, setCameraProps] = useState(INITIAL_CAMERA);

  const handleCameraChange = useCallback((ev) => {
    setCameraProps(ev.detail)
  }
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBS,
  });

  useEffect(() => {
    async function getData() {
      try {
        const { data } = await api.get('/calls/getAll');
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
      const { data } = await api.get('/calls/getAll');
      console.log("Atualizando calls:", data);
      setCalls(data);
      setFind();
      setCameraProps({
        center: newCenter,
        zoom: 12
      });
    } catch (error) {
      console.log(error);
    }
  }

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex' }}>
      {
        find &&
        <div style={{ width: '25vw', height: '100vh', border: '1px solid' }}>
          <CreateCall find={find} findCalls={findCalls} />
        </div>
      }

      <div style={{ width: find ? '75vw' : '100vw', height: '100vh' }}>
        <APIProvider apiKey={API_KEY}>
          <div>
            <PlacesAutocomplete setFind={setFind} setCameraProps={setCameraProps}></PlacesAutocomplete>
          </div>

          <Map
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
              }
            ]}
          >
            {
              calls.map((call) => (
                <AdvancedMarker
                  key={call.id}
                  position={{ lat: call.lat, lng: call.lng }}
                  onClick={() => setSelected(call)}
                >
                  <Pin
                    borderColor={'black'}
                    background={(function () {
                      switch (call.service) {
                        case 'Corte de Arvore':
                          return 'gray'
                        case 'Calçada quebrada':
                          return 'black'
                        case 'Mato alto':
                          return 'white'
                        case 'Afiação':
                          return 'orange'
                        case 'Asfalto':
                          return 'purple'

                        default:
                          break;
                      }
                    })()}
                    glyphColor={(function () {
                      if (moment(call.date).isAfter(oneWeek)) {
                        return "green";
                      } else if (moment(call.date).isAfter(oneMonth)) {
                        return "yellow";
                      }
                      return "red";
                    })()}
                  >

                  </Pin>
                </AdvancedMarker>
              ))
            }

            {
              find && <AdvancedMarker
                position={{ lat: find.lat, lng: find.lng }}
              >
                <Pin />
              </AdvancedMarker>
            }

            {
              selected && (
                <InfoWindow
                  position={{ lat: selected.lat, lng: selected.lng }}
                  onCloseClick={() => setSelected(null)}
                >
                  <div style={{ background: 'red' }}>
                    <p>{JSON.stringify(selected)}</p>
                  </div>
                </InfoWindow>
              )
            }
          </Map>
        </APIProvider >
      </div>
    </div>
  )
}