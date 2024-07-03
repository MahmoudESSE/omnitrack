import Head from "next/head";
import NavBar from "@/components/navBar";
import { useSession } from "next-auth/react";
import LoginForm from "@/components/loginForm";
import { Map } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { api } from "@/utils/api";
import DeckGl from "@deck.gl/react";
import { useState } from "react";
import { type MapViewState } from "@deck.gl/core";
import { type TransitionProps } from "node_modules/@deck.gl/core/dist/controllers/transition-manager";
import TrackerMapPin from "@/components/trackerMapPin";
import { Card, CardContent } from "@/components/ui/card";

const Home = () => {
  const { status } = useSession();

  const { data: map } = api.map.mapAccessToken.useQuery();

  const { data: trackers } = api.tracker.getAll.useQuery();

  const [viewState, setViewState] = useState<TransitionProps | MapViewState>({
    longitude: -6.8340222,
    latitude: 34.02236,
    zoom: 9,
  });

  if (status === "unauthenticated") {
    return (
      <>
        <Head>
          <title>OmniTrack</title>
          <meta name="description" content="track devices and manage them" />
          <link rel="icon" href="/inbox_tray/favicon.ico" />
        </Head>
        <div className="flex min-h-screen w-full flex-col">
          <LoginForm />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>OmniTrack</title>
        <meta name="description" content="track devices and manage them" />
        <link rel="icon" href="/inbox_tray/favicon.ico" />
      </Head>
      <div className="flex min-h-screen w-full flex-col">
        <NavBar />
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
          <Card>
            <CardContent>
              <DeckGl
                initialViewState={viewState}
                onViewStateChange={(e) => setViewState(e.viewState)}
                controller={true}
              >
                {map?.mapAccessToken && (
                  <Map
                    mapboxAccessToken={map.mapAccessToken}
                    mapStyle={map.mapStyle}
                    style={{ width: 400, height: 300 }}
                  >
                    {trackers?.map((tracker) => <TrackerMapPin {...tracker} />)}
                  </Map>
                )}
              </DeckGl>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default Home;
