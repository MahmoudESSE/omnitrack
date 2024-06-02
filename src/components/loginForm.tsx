import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";

const LoginForm = () => {
  return (
    <Card className="mx-auto h-full w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Button
            onClick={async () => await signIn("google")}
            variant="outline"
            className="w-full"
          >
            Login with Google
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
