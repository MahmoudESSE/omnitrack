import Head from "next/head";
import NavBar from "@/components/navBar";
import TrackerCardList from "@/components/trackerCardsList";
import { useSession } from "next-auth/react";
import LoginForm from "@/components/loginForm";
import Analytics from "@segment/analytics-node";
import { api } from "@/utils/api";

const Home = () => {
  const { data: sessionData, status } = useSession();

  const { data: segment } = api.segment.segment.useQuery();

  if (!segment?.segmentWriteKey) {
    return <></>;
  }
  const analytics = new Analytics({ writeKey: segment.segmentWriteKey });

  analytics.on("error", (err) => console.error(err));

  analytics.on("identify", (ctx) => console.log(ctx));

  analytics.on("track", (ctx) => console.log(ctx));

  analytics.on("http_request", (event) => console.log(event));

  if (status === "unauthenticated" || !sessionData?.user) {
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

  analytics.identify({
    userId: sessionData.user.id,
    traits: {
      name: sessionData.user.name,
      email: sessionData.user.name,
    },
  });

  analytics.page({
    userId: sessionData.user.id,
    category: "DashBoard",
    name: "Tracker Page",
    properties: {
      url: "https://omnitrack.dinopp.site",
      path: "/",
      title: "Tracker Page",
    }
  });

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
          <TrackerCardList />
        </main>
      </div>
    </>
  );
};

export default Home;
