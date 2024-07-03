import Head from "next/head";
import NavBar from "@/components/navBar";
import { useSession } from "next-auth/react";
import LoginForm from "@/components/loginForm";
import GroupSideBar from "@/components/groupSideBar";
import { api } from "@/utils/api";
import { type SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import MemberList from "@/components/memberList";

const MemberSchema = z.object({
  email: z.string().email(),
});

const MemberForm = () => {
  const utils = api.useUtils();
  const { mutateAsync: createMember } = api.group.create.useMutation({
    onSuccess: async () => {
      await utils.group.getAll.invalidate();
    },
  });

  type MemberType = Parameters<typeof createMember>[0];

  const form = useForm<MemberType>({
    resolver: zodResolver(MemberSchema),
  });

  const onSubmit: SubmitHandler<MemberType> = async (input) => {
    await createMember(input);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Member Email</FormLabel>
              <FormControl>
                <Input placeholder="Email du membre" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-min">
          Ajouter
        </Button>
      </form>
    </Form>
  );
};

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
            <div>
              <MemberForm />

              <MemberList />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
