import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  ControlPosition,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { api } from "../services/api";
import RenderTrees from "../Components/Trees/RenderTrees";
import PlacesAutocomplete from "../Components/PlacesAutocomplete";
import CreateCall from "../Components/CreateCall";
import RenderTrash from "../Components/Trash/RenderTrash";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = import.meta.env.VITE_PUBLIC_MAP_ID;
const LIBS = ["places"];
const DEFAULT_MAP_VALUES = {
  position: { lat: -21.97670490190296, lng: -46.78934397283814 },
  zoom: 15,
}


export default function Maps02() {
  const [point, setPoint] = useState();

  const [trees, setTress] = useState([]);
  const [showTrees, setShowTrees] = useState(false);

  const [trash, setTrash] = useState([]);
  const [showTrash, setShowTrash] = useState(false);

  const [zoom, setZoom] = useState(10);
  const [bounds, setBounds] = useState();

  useEffect(() => {
    async function getData() {
      try {
        const { data: dataTress } = await api.get("/trees/getAll");
        setTress(dataTress);
        const { data: dataTrash } = await api.get("/trash/getAll");
        setTrash(dataTrash);
      } catch (error) {
        console.log(error);
      }
    }

    setTimeout(getData, 1000);
  }, []);

  async function reloadTrash() {
    try {
      const { data } = await api.get("/trash/getAll");
      console.log(data);

      setTrash(data);
      setPoint();
    } catch (error) {
      console.log(error);
    }
  }

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBS,
  });

  function handleCreatePoint(e) {
    const { lat, lng } = e.detail.latLng;
    console.log(lat);
    console.log(lng);
    setPoint({ lat, lng });
  }

  return isLoaded ? (
    <div style={{ display: "flex" }}>
      {point && (
        <div>
          <CreateCall point={point} reloadTrash={reloadTrash} />
        </div>
      )}

      <div style={{ width: point ? "85vw" : "100vw", height: "100vh" }}>
        <APIProvider apiKey={API_KEY}>
          <div style={{ display: 'flex', width: '100%', height: '10%', justifyContent: 'center' }}>
            <button onClick={() => setShowTrees((p) => !p)} >
              {showTrees ? 'Esconder Arvores' : 'Mostrar Arvores'}
            </button>
            <h3>
              {zoom}
            </h3>
            <button onClick={() => setShowTrash((p) => !p)} >
              {showTrash ? 'Esconder pontos de coleta' : 'Mostrar pontos de coleta'}
            </button>
          </div>
          <PlacesAutocomplete
            setPoint={setPoint}
          />
          <div style={{ width: '100%', height: '90%' }}>
            <Map
              mapId={MAP_ID}
              mapTypeControlOptions={{
                position: ControlPosition.INLINE_END_BLOCK_START,
              }}
              onClick={handleCreatePoint}
              colorScheme="DARK"
              defaultCenter={DEFAULT_MAP_VALUES.position}
              defaultZoom={DEFAULT_MAP_VALUES.zoom}
              onBoundsChanged={({ detail: { bounds, zoom } }) => {
                setZoom(zoom);
                setBounds([
                  bounds.west,
                  bounds.south,
                  bounds.east,
                  bounds.north,
                ]);
              }}
            >

              <RenderTrees trees={trees} bounds={bounds} zoom={zoom} showTrees={showTrees} />

              {
                trash.map((element) => (
                  <RenderTrash key={element.id} trash={element} showTrash={showTrash} />
                ))
              }


              {point && (
                <AdvancedMarker position={{ lat: point.lat, lng: point.lng }} onClick={() => setPoint(null)}>
                  <Pin />
                </AdvancedMarker>
              )}

            </Map>
          </div>
        </APIProvider>
      </div>
    </div>
  ) : <div>Loading...</div>;
};
