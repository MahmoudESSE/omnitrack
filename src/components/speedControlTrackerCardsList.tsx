import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/utils/api";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MapPin } from "lucide-react";
import LocationInformation from "@/components/locationInformation";
import { useState } from "react";
import { SpeedLimitForm } from "./speedLimitForm";

const SpeedControlTrackerCardList = () => {
  const [speed_limit, setSpeedLimit] = useState(0);
  const { data: trackers } = api.tracker.getAllSpeedBarier.useQuery({
    speed: speed_limit,

  });
  const utils = api.useUtils();

    function editSpeedLimit(speed: number) {
    console.log("Speed Limit: " + speed);
    setSpeedLimit(speed);
  }

  if (!!!trackers) {
    return <></>;
  }


  return (
    <>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="border-emerald-600">Set Speed Limit</Button>
        </DialogTrigger>
        <DialogContent>
          <SpeedLimitForm
            title={"Set Speed Limit "}
            submitText="Save"
            speed_limit={{ speed: speed_limit }}
            action={(formSpeedLimit) =>
              editSpeedLimit(formSpeedLimit)
            }
          />
        </DialogContent>
      </Dialog>
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
                <CardFooter className="flex items-center gap-4 border-t px-6 py-4">
                  <div>
                    <p className="text-destructive">{tracker.speed}</p>
                  </div>
                  <p className="text-destructive">Speed Limit passed</p>
                </CardFooter>
              </Card>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default SpeedControlTrackerCardList;
