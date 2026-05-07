import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormField from "../../components/forms/FormField.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { loginSchema } from "../../utils/formSchemas.js";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (values) => {
    const data = await login(values);
    const redirectPath = location.state?.from?.pathname;
    navigate(redirectPath || (data.user.role === "admin" ? "/admin-dashboard" : "/dashboard"));
  };

  return (
    <section className="auth-layout">
      <div className="auth-hero">
        <p className="eyebrow">Unified team workspace</p>
        <h1>Plan projects, align teams, and ship work with clarity.</h1>
        <p>
          Bring projects, tasks, deadlines, and team updates into one calm, focused workspace built for execution.
        </p>
      </div>

      <div className="auth-card">
        <h2>Sign in</h2>
        <p className="muted-text">Use your workspace credentials to continue.</p>

        <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Email" error={errors.email?.message}>
            <input type="email" {...register("email")} placeholder="admin@ethara.ai" />
          </FormField>

          <FormField label="Password" error={errors.password?.message}>
            <div className="password-input">
              <input type={showPassword ? "text" : "password"} {...register("password")} placeholder="********" />
              <button type="button" className="icon-button" onClick={() => setShowPassword((current) => !current)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FormField>

          <div className="inline-row">
            <label className="checkbox-row">
              <input type="checkbox" {...register("rememberMe")} />
              Remember me
            </label>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="footer-text">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
