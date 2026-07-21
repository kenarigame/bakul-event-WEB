import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusCircle, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { vouchersApi } from "@/services/api.service";
import { formatDate } from "@/lib/utils";

const voucherSchema = z.object({
  code: z.string().min(3),
  discount: z.number().positive(),
  isPercent: z.boolean(),
  maxUses: z.number().int().positive(),
  minPurchase: z.number().min(0).optional(),
  maxDiscount: z.number().min(0).optional(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
});

type VoucherForm = z.infer<typeof voucherSchema>;

export function VoucherManagementPage() {
  const { id: eventId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["vouchers", eventId],
    queryFn: () => vouchersApi.getByEvent(eventId!),
    enabled: !!eventId,
  });

  const vouchers = (data?.data as { data?: VoucherForm[] })?.data || [];

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VoucherForm>({
    resolver: zodResolver(
      voucherSchema,
    ) as import("react-hook-form").Resolver<VoucherForm>,
    defaultValues: { isPercent: true, maxUses: 100 },
  });

  const createMutation = useMutation({
    mutationFn: (formData: VoucherForm) =>
      vouchersApi.create(eventId!, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers", eventId] });
      toast.success("Voucher created!");
      setShowForm(false);
      reset();
    },
    onError: () => toast.error("Failed to create voucher"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => vouchersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers", eventId] });
      toast.success("Voucher deleted");
    },
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Voucher Management
          </h1>
          <p className="text-muted-foreground">
            Create and manage discount vouchers for this event
          </p>
        </div>
      </div>

      <Button onClick={() => setShowForm((s) => !s)}>
        <PlusCircle className="mr-2 size-4" />
        {showForm ? "Cancel" : "Create Voucher"}
      </Button>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New Voucher</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit((d) => createMutation.mutate(d))}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Voucher Code *</Label>
                  <Input
                    {...register("code")}
                    placeholder="DISCOUNT20"
                    className="mt-1 uppercase"
                  />
                  {errors.code && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.code.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Max Uses *</Label>
                  <Input
                    type="number"
                    {...register("maxUses", { valueAsNumber: true })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Discount Value *</Label>
                  <Input
                    type="number"
                    {...register("discount", { valueAsNumber: true })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Controller
                      name="isPercent"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <span className="text-sm">Percentage (%)</span>
                  </div>
                </div>
                <div>
                  <Label>Start Date *</Label>
                  <Input
                    type="datetime-local"
                    {...register("startDate")}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>End Date *</Label>
                  <Input
                    type="datetime-local"
                    {...register("endDate")}
                    className="mt-1"
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
                Create Voucher
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Voucher List */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
          vouchers as Array<{
            id: string;
            code: string;
            discount: number;
            isPercent: boolean;
            usedCount: number;
            maxUses: number;
            startDate: string;
            endDate: string;
          }>
        ).length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No vouchers created yet
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {(
            vouchers as Array<{
              id: string;
              code: string;
              discount: number;
              isPercent: boolean;
              usedCount: number;
              maxUses: number;
              startDate: string;
              endDate: string;
            }>
          ).map((v) => (
            <Card key={v.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <code className="font-mono font-bold">{v.code}</code>
                    <Badge variant="secondary">
                      {v.discount}
                      {v.isPercent ? "%" : " IDR"} off
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Used: {v.usedCount}/{v.maxUses} · Valid:{" "}
                    {formatDate(v.startDate)} – {formatDate(v.endDate)}
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Voucher</AlertDialogTitle>
                      <AlertDialogDescription>
                        Delete voucher "{v.code}"? This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate(v.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
