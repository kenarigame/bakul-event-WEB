import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Calendar, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { authApi } from "@/services/api.service";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["CUSTOMER", "ORGANIZER"]),
    referralCode: z.string().optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "CUSTOMER" },
  });

  const role = watch("role");

  const onSubmit = async (data: RegisterForm) => {
    try {
      await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        referralCode: data.referralCode,
      });
      toast.success("Account created successfully! Please sign in.");
      navigate("/login");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Registration failed";
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-bold text-xl"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Calendar className="size-4" />
            </div>
            Bakul Events
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              Join Bakul Events to discover and host events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Account Type */}
              <div className="space-y-2">
                <Label>I want to</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(v) =>
                    setValue("role", v as "CUSTOMER" | "ORGANIZER")
                  }
                  className="grid grid-cols-2 gap-2"
                >
                  {[
                    { value: "CUSTOMER", label: "Attend Events" },
                    { value: "ORGANIZER", label: "Host Events" },
                  ].map((opt) => (
                    <div
                      key={opt.value}
                      className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer transition-colors ${role === opt.value ? "border-primary bg-primary/5" : "hover:bg-muted"}`}
                      onClick={() =>
                        setValue("role", opt.value as "CUSTOMER" | "ORGANIZER")
                      }
                    >
                      <RadioGroupItem value={opt.value} id={opt.value} />
                      <Label
                        htmlFor={opt.value}
                        className="cursor-pointer text-sm"
                      >
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  {...register("name")}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    {...register("password")}
                    aria-invalid={!!errors.password}
                    className="pr-9"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  aria-invalid={!!errors.confirmPassword}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralCode">
                  Referral Code{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="referralCode"
                  placeholder="Enter referral code"
                  {...register("referralCode")}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Create Account
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
