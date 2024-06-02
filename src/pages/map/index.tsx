import Head from "next/head";
import NavBar from "@/components/navBar";
import { useSession } from "next-auth/react";
import LoginForm from "@/components/loginForm";
import { Map, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { api } from "@/utils/api";
import DeckGl from "@deck.gl/react";
import { useState } from "react";
import { type MapViewState } from "@deck.gl/core";
import { type TransitionProps } from "node_modules/@deck.gl/core/dist/controllers/transition-manager";

const Home = () => {
  const { status } = useSession();

  const { data: map } = api.map.mapAccessToken.useQuery();
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
          <div className="h-full w-full">
            <DeckGl
              initialViewState={viewState}
              onViewStateChange={(e) => setViewState(e.viewState)}
              controller={true}
            >
              {map?.mapAccessToken && (
                <Map
                  mapboxAccessToken={map.mapAccessToken}
                  mapStyle={map.mapStyle}
                >
                  <Marker
                    longitude={-6.651904}
                    latitude={34.249114}
                    color="red"
                  />
                </Map>
              )}
            </DeckGl>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
