import { AdvancedMarker, InfoWindow, useAdvancedMarkerRef, useMap } from "@vis.gl/react-google-maps";
import { useState } from "react";
import moment from "moment";

export function RenderIfNotCluster({ cluster, position }) {
  const map = useMap();
  const [showInfoWindow, setShowInfoWindow] = useState(false)
  const [markerRef, marker] = useAdvancedMarkerRef();

  function returnThree(value) {
    switch (value) {
      case 'Pinheiro':
        return '🌲';
      case 'Arvore':
        return "🌳";
      case 'Coqueiro':
        return "🌴";

      default:
        break;
    }
  };

  return (
    <>
      <AdvancedMarker
        key={cluster.properties.id}
        ref={markerRef}
        position={position}
        style={{ fontSize: '2rem' }}
        onClick={() => {
          map.setCenter(position);
          setShowInfoWindow(true);
        }}
      >
        <span>{returnThree(cluster.properties.type)}</span>
      </AdvancedMarker>

      {
        showInfoWindow && (
          <InfoWindow
            anchor={marker}
            onCloseClick={() => setShowInfoWindow(false)}
          >
            <div>
              <p>Tipo: {cluster.properties.type}</p>
              <p>
                {
                  cluster.properties.lastCut ?
                    `Ultima vez podada: ${moment(cluster.properties.lastCut).format('DD/MM/YYYY')}` :
                    'Nunca podada'
                }
              </p>
            </div>
          </InfoWindow>
        )
      }
    </>
  )
}