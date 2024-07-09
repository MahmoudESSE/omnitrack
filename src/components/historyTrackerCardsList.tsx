import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/utils/api";
import { MapPin } from "lucide-react";
import LocationInformation from "@/components/locationInformation";

const HistoryTrackerCardList = () => {
  const { data: trackers } = api.tracker.getAll.useQuery();
  const utils = api.useUtils();

  if (!!!trackers) {
    return <></>;
  }


  return (
    <ul className="flex flex-row flex-wrap gap-4">
      {trackers.map((tracker) => {
        return (
          <li key={tracker.id}>
            <Card>
              <CardHeader>
                <CardTitle>{tracker.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <MapPin className="size-6 h-6 w-6 rounded-xl text-destructive ring ring-destructive" />
                <LocationInformation tracker={tracker} />
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ul>
  );
};

export default HistoryTrackerCardList;
