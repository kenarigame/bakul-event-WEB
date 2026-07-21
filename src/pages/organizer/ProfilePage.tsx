import { useAuthStore } from "@/store/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function OrganizerProfilePage() {
  const { user } = useAuthStore();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Organizer Profile</h1>
        <p className="text-muted-foreground">Your organizer information</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="size-16">
              <AvatarImage src={user?.organizer?.logo} />
              <AvatarFallback className="text-xl">
                {user?.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">
                {user?.organizer?.name || user?.name}
              </h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <Badge className="mt-1">ORGANIZER</Badge>
            </div>
          </div>
          {user?.organizer?.description && (
            <p className="text-muted-foreground">
              {user.organizer.description}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
