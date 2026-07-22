import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusCircle, Trash2, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { eventsApi } from "@/services/api.service";

const ticketSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["FREE", "PAID"]),
  price: z.number().min(0),
  quantity: z.number().int().positive(),
  maxPerOrder: z.number().int().positive(),
});

const schema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  categoryId: z.string().min(1),
  venue: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  province: z.string().optional(),
  googleMapsUrl: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  registrationDeadline: z.string().min(1),
  capacity: z.number().int().positive(),
  terms: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  tickets: z.array(ticketSchema).min(1),
});

type EventFormData = z.infer<typeof schema>;

export function CreateEventPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn: () => eventsApi.getCategories(),
  });

  const categories = categoriesRes?.data?.data || [];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(
      schema,
    ) as import("react-hook-form").Resolver<EventFormData>,
    defaultValues: {
      tickets: [
        {
          name: "General Admission",
          type: "PAID",
          price: 0,
          quantity: 100,
          maxPerOrder: 10,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tickets",
  });

  const createMutation = useMutation({
    mutationFn: (data: EventFormData) => eventsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer-events"] });
      toast.success("Event created successfully!");
      navigate("/organizer/events");
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to create event";
      toast.error(message);
    },
  });

  const onSubmit: import("react-hook-form").SubmitHandler<EventFormData> = (
    data,
  ) => createMutation.mutate(data);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Event</h1>
          <p className="text-muted-foreground">
            Fill in the details for your new event
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Event Name *</Label>
              <Input
                {...register("name")}
                placeholder="Amazing Tech Conference 2026"
                className="mt-1"
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label>Category *</Label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat: { id: string; name: string }) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && (
                <p className="text-xs text-destructive mt-1">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div>
              <Label>Description *</Label>
              <Textarea
                {...register("description")}
                placeholder="Describe your event..."
                rows={5}
                className="mt-1"
              />
              {errors.description && (
                <p className="text-xs text-destructive mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Date & Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Date & Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Start Date *</Label>
                <Input
                  type="datetime-local"
                  {...register("startDate")}
                  className="mt-1"
                />
                {errors.startDate && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div>
                <Label>End Date *</Label>
                <Input
                  type="datetime-local"
                  {...register("endDate")}
                  className="mt-1"
                />
                {errors.endDate && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label>Registration Deadline *</Label>
              <Input
                type="datetime-local"
                {...register("registrationDeadline")}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Venue Name *</Label>
              <Input
                {...register("venue")}
                placeholder="Jakarta Convention Center"
                className="mt-1"
              />
              {errors.venue && (
                <p className="text-xs text-destructive mt-1">
                  {errors.venue.message}
                </p>
              )}
            </div>
            <div>
              <Label>Full Address *</Label>
              <Input
                {...register("address")}
                placeholder="Jl. Gatot Subroto No. 1"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>City *</Label>
                <Input
                  {...register("city")}
                  placeholder="Jakarta"
                  className="mt-1"
                />
                {errors.city && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Province</Label>
                <Input
                  {...register("province")}
                  placeholder="DKI Jakarta"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label>Google Maps URL</Label>
              <Input
                {...register("googleMapsUrl")}
                placeholder="https://maps.google.com/..."
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Capacity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Capacity & Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Total Capacity *</Label>
              <Input
                type="number"
                {...register("capacity", { valueAsNumber: true })}
                placeholder="500"
                className="mt-1"
              />
              {errors.capacity && (
                <p className="text-xs text-destructive mt-1">
                  {errors.capacity.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Contact Email</Label>
                <Input
                  type="email"
                  {...register("contactEmail")}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Contact Phone</Label>
                <Input {...register("contactPhone")} className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Ticket Types *</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    name: "",
                    type: "PAID",
                    price: 0,
                    quantity: 50,
                    maxPerOrder: 10,
                  })
                }
              >
                <PlusCircle className="mr-2 size-4" />
                Add Ticket
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 rounded-lg border space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Ticket {index + 1}</p>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Name</Label>
                    <Input
                      {...register(`tickets.${index}.name`)}
                      placeholder="General Admission"
                      className="mt-1 h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Type</Label>
                    <Controller
                      name={`tickets.${index}.type`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="mt-1 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FREE">Free</SelectItem>
                            <SelectItem value="PAID">Paid</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Price (IDR)</Label>
                    <Input
                      type="number"
                      {...register(`tickets.${index}.price`, {
                        valueAsNumber: true,
                      })}
                      className="mt-1 h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Quantity</Label>
                    <Input
                      type="number"
                      {...register(`tickets.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                      className="mt-1 h-8"
                    />
                  </div>
                </div>
              </div>
            ))}
            {errors.tickets && (
              <p className="text-xs text-destructive">
                {errors.tickets.message}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isSubmitting || createMutation.isPending}
          >
            {(isSubmitting || createMutation.isPending) && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Create Event
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
