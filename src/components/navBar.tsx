import { CircleUser, Inbox, Menu, Package2, Plus, Search } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TrackerForm } from "./trackerForm";
import { type TrackerType } from "@/server/helpers/trackerValidator";
import { api } from "@/utils/api";
import Analytics from "@segment/analytics-node";

const NavBar = () => {
  const { data: sessionData } = useSession();
  const utils = api.useUtils();
  const { mutate: mutateTracker } = api.tracker.create.useMutation({
    onSuccess: async () => {
      await utils.tracker.getAll.invalidate();
    },
  });

  if (!sessionData) {
    return <></>;
  }

  const { data: segment } = api.segment.segment.useQuery();

  if (!segment?.segmentWriteKey) {
    return <></>;
  }

  const analytics = new Analytics({ writeKey: segment.segmentWriteKey });

  analytics.on("error", (err) => console.error(err));

  analytics.on("identify", (ctx) => console.log(ctx));

  analytics.on("track", (ctx) => console.log(ctx));

  analytics.on("http_request", (event) => console.log(event));

  analytics.identify({
    userId: sessionData.user.id,
    traits: {
      name: sessionData.user.name,
      email: sessionData.user.name,
    },
  });

  function addTracker(tracker: TrackerType) {
    console.log("Added:" + JSON.stringify(tracker));
    mutateTracker(tracker);
    if (!sessionData) {
      return;
    }

    analytics.track({
      userId: sessionData.user.id,
      event: "Added a tracker",
    });
  }

  return (
    <>
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Inbox className="h-6 w-6" />
            <span className="sr-only">OmniTrack Inc</span>
          </Link>
          <Link
            href="/"
            className="text-foreground transition-colors hover:text-foreground"
          >
            Trackers
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-emerald-600"
                size="icon"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <TrackerForm
                title="Ajouter Tracker"
                submitText="Ajouter"
                action={addTracker}
              />
            </DialogContent>
          </Dialog>
          <Link
            href="/map"
            className="text-foreground transition-colors hover:text-foreground"
          >
            Map
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Trackers
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                AddTracker
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial"></div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                {!sessionData?.user && <CircleUser className="h-5 w-5" />}
                {sessionData?.user && sessionData?.user.image && (
                  <Image
                    src={sessionData?.user.image}
                    alt=""
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                )}
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {sessionData?.user.name ?? "My Account"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <Link
                href="/group"
                className="text-foreground transition-colors hover:text-foreground"
              >
                <DropdownMenuItem>Group</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  type="button"
                  onClick={
                    sessionData ? () => void signOut() : () => void signIn()
                  }
                >
                  {sessionData ? "Log Out" : "Log In"}
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
};

export default NavBar;
