import { type TrackerType } from "@/server/helpers/trackerValidator";
import mapboxgl from "mapbox-gl";
import { useCallback, useMemo, useRef } from "react";
import { Marker } from "react-map-gl";
import { Button } from "./ui/button";

const TrackerMapPin = (tracker: TrackerType) => {
  const trackerMarkerRef = useRef<mapboxgl.Marker>(null);

  const trackerMarkerPopup = useMemo(() => {
    return new mapboxgl.Popup().setText(tracker.name);
  }, []);

  const toggleTrackerMarkerPopup = useCallback(() => {
    trackerMarkerRef.current?.togglePopup();
  }, []);

  return (
    <>
      <Marker
        longitude={tracker.longtitude ?? 0}
        latitude={tracker.latitude ?? 0}
        color="red"
        popup={trackerMarkerPopup}
        ref={trackerMarkerRef}
        onClick={toggleTrackerMarkerPopup}
      />
      <Button onClick={toggleTrackerMarkerPopup}> popup!</Button>
    </>
  );
};

export default TrackerMapPin;
