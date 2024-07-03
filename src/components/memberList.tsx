import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";

const MemberList = () => {
  const { data: sessionData, status: sessionStatus } = useSession();

  const { data: groupMembers, status } = api.group.getAll.useQuery();

  if (status === "error" || status === "pending") {
    return <></>;
  }

  if (sessionStatus === "unauthenticated" || !sessionData?.user) {
    return <></>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{`${sessionData.user.name} space`}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {groupMembers.map((groupMember) => (
          <div className="flex items-center gap-4">
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                {groupMember.member_email}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MemberList;
