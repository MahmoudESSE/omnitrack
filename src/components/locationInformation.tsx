import { type TrackerType } from "@/server/helpers/trackerValidator";
import { api } from "@/utils/api";
import { Label } from "@/components/ui/label";

interface LocationInformationProps {
  tracker: TrackerType;
}

const LocationInformation = ({ tracker }: LocationInformationProps) => {
  const { data: location } = api.map.reverseGeocoding.useQuery(
    {
      tracker: {
        longitude: tracker.longtitude!,
        latitude: tracker.latitude!,
      },
    },
    {
      initialData: { features: [{ properties: { full_address: "" } }] },
    },
  );

  if (!location?.features) {
    return <></>;
  }

  return (
    <div>
      <Label>{location.features[0]?.properties.full_address}</Label>
    </div>
  );
};

export default LocationInformation;
