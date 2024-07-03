import { type TrackerType } from "@/server/helpers/trackerValidator";
import { api } from "@/utils/api";
import { type MapViewState } from "@deck.gl/core";
import { DeckGL } from "@deck.gl/react";
import { type TransitionProps } from "node_modules/@deck.gl/core/dist/controllers/transition-manager";
import { useState } from "react";

import { Map, Marker } from "react-map-gl";

interface MapCheckLocationProps {
  tracker: TrackerType;
}

const MapCheckLocation = ({ tracker }: MapCheckLocationProps) => {
  const { data: map } = api.map.mapAccessToken.useQuery();

  const [viewState, setViewState] = useState<TransitionProps | MapViewState>({
    longitude: -6.8340222,
    latitude: 34.02236,
    zoom: 9,
  });
  const { data: mapTracker } = api.tracker.searchFor.useQuery({
    tracker: tracker,
  });

  if (!!!mapTracker) {
    return <></>;
  }

  return (
    <>
      <DeckGL
        initialViewState={viewState}
        onViewStateChange={(e) => setViewState(e.viewState)}
        controller={true}
      >
        {map?.mapAccessToken && (
          <Map mapboxAccessToken={map.mapAccessToken} mapStyle={map.mapStyle}>
            <Marker
              longitude={mapTracker.longtitude ?? 0}
              latitude={mapTracker.latitude ?? 0}
              color="red"
            />
            )
          </Map>
        )}
      </DeckGL>
    </>
  );
};

export default MapCheckLocation;
