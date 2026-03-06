import { useSignupStore } from "../store/signupStore";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { SignupForm } from "../components/SignupForm";

export function Signup() {
  const {
    email,
    password,
    showPassword,
    setField,
    toggleShowPassword,
    signup,
    isSigningUp,
    error,
  } = useSignupStore();

  const navigate = useNavigate();
  const { checkAuth } = useAuthStore();

  const validateForm = () => {
    const trimmedEmail = email?.trim() ?? "";
    const trimmedPassword = password?.trim() ?? "";

    if (!trimmedEmail) return (toast.error("Email is required"), false);
    if (!trimmedPassword) return (toast.error("Password is required"), false);
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = { email: email.trim(), password };

    try {
      await signup(payload);
      toast.success("Account created! Tell us a bit more about you.");
      await checkAuth();
      navigate("/complete-user-registration", { replace: true });
    } catch (err) {
      const msg =
        typeof err === "string" ? err : (err?.message ?? "Signup failed");
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-n-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary-3/5 blur-[120px]" />
        <div className="absolute top-[40%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-2/5 blur-[100px]" />
      </div>

      <div className="w-full max-w-xl relative z-10">
        <div className="bg-white/80 md:backdrop-blur-xl shadow-2xl shadow-n-3/10 rounded-3xl border border-white/50 overflow-hidden">
          <div className="px-8 pt-10 text-center">
            <h1 className="h4 text-n-8 mb-2">Create your account</h1>
            <p className="body-2 text-n-4">
              Join the campus marketplace to buy and sell with ease.
            </p>
          </div>

          <div className="mt-2 animate-in fade-in slide-in-from-top-4 duration-500">
            <SignupForm
              onSubmit={onSubmit}
              email={email}
              setField={setField}
              showPassword={showPassword}
              password={password}
              toggleShowPassword={toggleShowPassword}
              isSigningUp={isSigningUp}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
