import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/services/auth/login";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";
import axios from "axios";

const loginSchema = z.object({
  identifier: z.string(),
  password: z.string(),
});

type FormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, isPending } = useLogin();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values);
      toast.dismiss();
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string };
        const message = data.message;
        toast.error(message);
      } else {
        toast.error("Something went wrong.");
      }
    }
  };

  return (
    <section className="max-w-md mx-auto">
      <h1 className="mt-[15vh] mb-8 text-3xl font-bold text-center text-neutral-700">
        Log in to your account
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email or username" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your password" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-[15px] font-medium text-orange-500 text-end">
              <Link to="/forgot-password" className="hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isPending}>
            Continue
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default Login;
