import useSupercluster from "use-supercluster";
import { RenderIfCluster } from "./RenderIfCluster";
import { RenderIfNotCluster } from "./RenderIfNotCluster";

export default function RenderTrees({ trees, showTrees, bounds, zoom }) {
  const points = trees.map((tree) => (
    {
      type: "Feature",
      properties: {
        cluster: false,
        ...tree,
      },
      geometry: {
        type: "Point",
        coordinates: [
          tree.lng,
          tree.lat
        ]
      }
    }
  ));

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 18 },
  });


  return trees && showTrees && (
    <>
      {
        clusters.map((cluster) => {
          const [lng, lat] = cluster.geometry.coordinates;
          const { cluster: isCluster, point_count: pointCount } = cluster.properties;

          if (isCluster) {
            return (
              <RenderIfCluster
                key={cluster.id}
                cluster={cluster}
                position={{ lat, lng }}
                size={`${40 + (pointCount / trees.length) * 20}px`}
                pointCount={pointCount}
                supercluster={supercluster}
              />
            )
          }

          return (
            <RenderIfNotCluster
              key={cluster.properties.id}
              cluster={cluster}
              position={{ lat, lng }}
            />
          )
        })
      }
    </>
  )
}