
import Head from "next/head";
import NavBar from "@/components/navBar";
import TrackerCardList from "@/components/trackerCardsList";
import { useSession } from "next-auth/react";
import LoginForm from "@/components/loginForm";
import Analytics from "@segment/analytics-node";
import { api } from "@/utils/api";
import FrontPage from "@/components/frontPage";
import HistoryTrackerCardList from "@/components/historyTrackerCardsList";

const Home = () => {
  const { data: sessionData, status } = useSession();


  if (status === "unauthenticated" || !sessionData?.user) {
    return (
      <>
        <Head>
          <title>OmniTrack</title>
          <meta name="description" content="track devices and manage them" />
          <link rel="icon" href="/inbox_tray/favicon.ico" />
        </Head>
        <div className="flex min-h-screen w-full flex-col">
          <FrontPage />
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
          <HistoryTrackerCardList />
        </main>
      </div>
    </>
  );
};

export default Home;
