import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";

const MemberList = () => {
  const { data: sessionData, status: sessionStatus } = useSession();

  const { data: groupMembers, status } = api.group.getAll.useQuery();

  const utils = api.useUtils();

  const { mutate: deleteMemberMutation } = api.group.delete.useMutation({
    onSuccess: async () => {
      await utils.group.getAll.invalidate();
    },
  });

  if (status === "error" || status === "pending") {
    return <></>;
  }

  if (sessionStatus === "unauthenticated" || !sessionData?.user) {
    return <></>;
  }

  function deleteMember(member_email: string) {
    console.log("Deleted: " + member_email);
    deleteMemberMutation({ member_email: member_email });
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>{`${sessionData.user.name} space`}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {groupMembers.map((groupMember) => (
          <div key={groupMember.groupId} className="flex items-center gap-4">
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                {groupMember.member_email}
              </p>
            </div>

            <Button
              variant="destructive"
              onClick={() => deleteMember(groupMember.member_email)}
            >
              Supprimer
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MemberList;
