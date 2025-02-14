import { AdvancedMarker, InfoWindow, useAdvancedMarkerRef, useMap } from "@vis.gl/react-google-maps";
import moment from "moment";
import { useState } from "react";

export default function RenderTrash({ trash, showTrash }) {
  const [showInfoWindow, setShowInfoWindow] = useState(false)
  const [markerRef, marker] = useAdvancedMarkerRef();

  return showTrash ? (
    <>
      <AdvancedMarker
        key={trash.id}
        ref={markerRef}
        position={{ lat: trash.lat, lng: trash.lng }}
        style={{ fontSize: '2rem' }}
        onClick={() => {
          setShowInfoWindow(true);
        }}
      >
        <span>🚯</span>
      </AdvancedMarker>

      {
        showInfoWindow && (
          <InfoWindow
            anchor={marker}
            onCloseClick={() => setShowInfoWindow(false)}
          >
            <div>
              <p>Tipo: {trash.type}</p>
              <p>Prioridade: {trash.priority}</p>
              <p>Data da criação: {moment(trash.date).format('DD/MM/YYYY')}</p>
              <p>Ultima vez limpo: {moment(trash.lastClean).format('DD/MM/YYYY')}</p>
            </div>
          </InfoWindow>
        )
      }
    </>

  ) : null;
};