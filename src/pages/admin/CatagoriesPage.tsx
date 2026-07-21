import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle, Loader2, Tag } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { eventsApi } from "@/services/api.service";
import api from "@/lib/api";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  icon: z.string().optional(),
  color: z.string().optional(),
  description: z.string().optional(),
});

export function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: () => eventsApi.getCategories(),
  });

  const categories = data?.data?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const createMutation = useMutation({
    mutationFn: (data: z.infer<typeof schema>) =>
      api.post("/admin/categories", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created!");
      setShowForm(false);
      reset();
    },
    onError: () => toast.error("Failed to create category"),
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage event categories</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}>
          <PlusCircle className="mr-2 size-4" />
          {showForm ? "Cancel" : "Add Category"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit((d) => createMutation.mutate(d))}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    {...register("name")}
                    placeholder="Music"
                    className="mt-1"
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Slug *</Label>
                  <Input
                    {...register("slug")}
                    placeholder="music"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Icon</Label>
                  <Input
                    {...register("icon")}
                    placeholder="music"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Color</Label>
                  <Input
                    type="color"
                    {...register("color")}
                    className="mt-1 h-9"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting || createMutation.isPending}
              >
                {(isSubmitting || createMutation.isPending) && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Create
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map(
          (cat: {
            id: string;
            name: string;
            slug: string;
            color?: string;
            icon?: string;
          }) => (
            <Card key={cat.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="flex size-8 items-center justify-center rounded-lg text-white text-sm"
                    style={{ backgroundColor: cat.color || "#6366f1" }}
                  >
                    <Tag className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">{cat.slug}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ),
        )}
      </div>
    </div>
  );
}
