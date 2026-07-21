import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Tag, Gift, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  eventsApi,
  transactionsApi,
  vouchersApi,
  dashboardApi,
} from "@/services/api.service";
import { formatIDR } from "@/lib/utils";
import type { Ticket as TicketType } from "@/services/api.service";

export function CheckoutPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const [selectedTickets, setSelectedTickets] = useState<
    Record<string, number>
  >({});
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    discount: number;
    isPercent: boolean;
    maxDiscount?: number;
  } | null>(null);
  const [pointsToUse, setPointsToUse] = useState(0);

  const { data: eventRes } = useQuery({
    queryKey: ["event-by-id", eventId],
    queryFn: () => eventsApi.getAll({ id: eventId }),
  });

  // Get event by fetching all and filtering - we actually need by ID
  const { data: pointsRes } = useQuery({
    queryKey: ["points-summary"],
    queryFn: () => dashboardApi.getPoints({ limit: 1 }),
  });

  const totalPoints = pointsRes?.data?.data?.totalPoints || 0;

  // Calculate subtotal
  const eventData = eventRes?.data?.data;
  const event = Array.isArray(eventData)
    ? eventData[0]
    : (eventData as unknown);
  const tickets: TicketType[] =
    (event as { tickets?: TicketType[] } | undefined)?.tickets || [];

  const subtotal = Object.entries(selectedTickets).reduce(
    (sum, [ticketId, qty]) => {
      const ticket = tickets.find((t) => t.id === ticketId);
      if (!ticket || ticket.type === "FREE") return sum;
      return sum + ticket.price * qty;
    },
    0,
  );

  const voucherDiscount = appliedVoucher
    ? appliedVoucher.isPercent
      ? Math.min(
          subtotal * (appliedVoucher.discount / 100),
          appliedVoucher.maxDiscount || Infinity,
        )
      : appliedVoucher.discount
    : 0;

  const pointsDiscount = pointsToUse;
  const total = Math.max(0, subtotal - voucherDiscount - pointsDiscount);

  const validateVoucher = async () => {
    if (!voucherCode || !eventId) return;
    try {
      const res = await vouchersApi.validate(eventId, voucherCode);
      const v = (
        res.data as {
          data?: typeof appliedVoucher & {
            discount: number;
            isPercent: boolean;
          };
        }
      ).data;
      if (v) {
        setAppliedVoucher({
          code: voucherCode.toUpperCase(),
          discount: v.discount,
          isPercent: v.isPercent,
        });
        toast.success("Voucher applied!");
      }
    } catch {
      toast.error("Invalid or expired voucher code");
    }
  };

  const checkoutMutation = useMutation({
    mutationFn: () =>
      transactionsApi.checkout({
        eventId,
        tickets: Object.entries(selectedTickets)
          .filter(([, qty]) => qty > 0)
          .map(([ticketId, quantity]) => ({ ticketId, quantity })),
        voucherCode: appliedVoucher?.code,
        pointsToUse,
      }),
    onSuccess: (res) => {
      const tx = (res.data as { data?: { id: string } }).data;
      toast.success("Checkout successful!");
      navigate(`/transactions/${tx?.id || ""}`);
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Checkout failed";
      toast.error(message);
    },
  });

  const totalTickets = Object.values(selectedTickets).reduce(
    (a, b) => a + b,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
          <p className="text-muted-foreground">Complete your booking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Step 1: Choose Tickets */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Ticket className="size-4" />
                Step 1: Choose Tickets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tickets.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Loading tickets...
                </p>
              ) : (
                tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium text-sm">{ticket.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {ticket.available} available
                      </p>
                      <p className="text-sm font-semibold mt-1">
                        {ticket.type === "FREE" ? (
                          <Badge variant="secondary" className="text-xs">
                            Free
                          </Badge>
                        ) : (
                          formatIDR(ticket.price)
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() =>
                          setSelectedTickets((p) => ({
                            ...p,
                            [ticket.id]: Math.max(0, (p[ticket.id] || 0) - 1),
                          }))
                        }
                      >
                        -
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {selectedTickets[ticket.id] || 0}
                      </span>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() =>
                          setSelectedTickets((p) => ({
                            ...p,
                            [ticket.id]: Math.min(
                              ticket.maxPerOrder,
                              ticket.available,
                              (p[ticket.id] || 0) + 1,
                            ),
                          }))
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Step 2: Voucher */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Tag className="size-4" />
                Step 2: Voucher (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter voucher code"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  disabled={!!appliedVoucher}
                />
                {appliedVoucher ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAppliedVoucher(null);
                      setVoucherCode("");
                    }}
                  >
                    Remove
                  </Button>
                ) : (
                  <Button onClick={validateVoucher} disabled={!voucherCode}>
                    Apply
                  </Button>
                )}
              </div>
              {appliedVoucher && (
                <div className="mt-2 flex items-center gap-2 text-emerald-600 text-sm">
                  <Tag className="size-4" />
                  <span>
                    Voucher applied: -
                    {appliedVoucher.isPercent
                      ? `${appliedVoucher.discount}%`
                      : formatIDR(appliedVoucher.discount)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 3: Points */}
          {totalPoints > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Gift className="size-4" />
                  Step 3: Use Points (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Available: {totalPoints.toLocaleString()} pts ={" "}
                  {formatIDR(totalPoints)}
                </p>
                <Slider
                  min={0}
                  max={Math.min(totalPoints, subtotal - voucherDiscount)}
                  step={1000}
                  value={[pointsToUse]}
                  onValueChange={(value) => {
                    const points = Array.isArray(value) ? value[0] : value;
                    setPointsToUse(points);
                  }}
                  className="mb-2"
                />
                <p className="text-sm">
                  Using:{" "}
                  <span className="font-semibold">
                    {pointsToUse.toLocaleString()} pts
                  </span>{" "}
                  = {formatIDR(pointsToUse)} discount
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subtotal ({totalTickets} tickets)
                  </span>
                  <span>{formatIDR(subtotal)}</span>
                </div>
                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Voucher Discount</span>
                    <span>-{formatIDR(voucherDiscount)}</span>
                  </div>
                )}
                {pointsDiscount > 0 && (
                  <div className="flex justify-between text-amber-600">
                    <span>Points Discount</span>
                    <span>-{formatIDR(pointsDiscount)}</span>
                  </div>
                )}
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-lg">{formatIDR(total)}</span>
              </div>

              {total === 0 && totalTickets > 0 && (
                <p className="text-xs text-emerald-600 text-center">
                  This order is free!
                </p>
              )}

              <Button
                className="w-full"
                disabled={totalTickets === 0 || checkoutMutation.isPending}
                onClick={() => checkoutMutation.mutate()}
              >
                {checkoutMutation.isPending && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                {total === 0 ? "Confirm Booking" : "Proceed to Payment"}
              </Button>

              {total > 0 && (
                <p className="text-xs text-center text-muted-foreground">
                  You'll need to upload payment proof within 2 hours
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
