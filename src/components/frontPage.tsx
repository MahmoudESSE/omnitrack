import { MapPin, Users } from "lucide-react";
import { Button } from "./ui/button";
import LoginForm from "./loginForm";
import { signIn } from "next-auth/react";

const FrontPage = () => {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <h1 className="text-6xl font-bold">
            Welcome to <span className="text-blue-600">OmniTrack</span>
          </h1>

          <p className="mt-3 text-2xl">
            Your solution to tracking devices in your organization or day-to-day
            life.
          </p>

          <div className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
            <div className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600">
              <h3 className="text-2xl font-bold">Features</h3>
              <p className="mt-4 text-xl">
                track all your devices using mobile and web apps.
              </p>
            </div>

            <div className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600">
              <h3 className="text-2xl font-bold">Team</h3>
              <p className="mt-4 text-xl">
                Collaborate with your team seamlessly.
              </p>
            </div>

            <div className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600">
              <h3 className="text-2xl font-bold">Map</h3>
              <p className="mt-4 text-xl">
                monitor your tracker in live 3D map.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={async () => await signIn("google")}
              className="flex items-center"
            >
              <MapPin className="mr-2" />
              Get started
            </Button>
            <Button className="ml-4 flex items-center" variant="secondary">
              <Users className="mr-2" />
              Learn More
            </Button>
          </div>
        </main>
      </div>
    </>
  );
};

export default FrontPage;
