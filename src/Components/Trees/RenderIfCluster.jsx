import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";

export function RenderIfCluster({ cluster, position, size, pointCount, supercluster }) {
  const map = useMap();

  return (
    <AdvancedMarker
      key={cluster.properties.id}
      position={position}
      onClick={() => {
        const expansionZoom = Math.min(
          supercluster.getClusterExpansionZoom(cluster.id), 20
        )
        map.setCenter(position);
        map.setZoom(expansionZoom);
      }}
    >
      <div style={{
        width: size,
        height: size,
        backgroundColor: 'blue',
        padding: 1,
        borderRadius: '20px',
        textAlign: 'center',
        alignContent: 'center',
        fontSize: '1rem',
        color: 'white'
      }}>
        {pointCount}
      </div>
    </AdvancedMarker>
  )
};