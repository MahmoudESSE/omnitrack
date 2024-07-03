import Head from "next/head";
import NavBar from "@/components/navBar";
import { useSession } from "next-auth/react";
import LoginForm from "@/components/loginForm";
import GroupSideBar from "@/components/groupSideBar";
import MemberList from "@/components/memberList";

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
          <div className="mx-auto grid w-full max-w-6xl gap-2">
            <h1 className="text-3xl font-semibold">Group Settings</h1>
          </div>
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
            <GroupSideBar />

            <MemberList />
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
