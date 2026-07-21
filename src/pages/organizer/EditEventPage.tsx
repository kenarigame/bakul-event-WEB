import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function EditEventPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Event</h1>
          <p className="text-muted-foreground">Update event details</p>
        </div>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center py-8">
            Edit form for event ID: {id}
          </p>
          <p className="text-center text-sm text-muted-foreground">
            This uses the same form as Create Event, pre-populated with existing
            data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
