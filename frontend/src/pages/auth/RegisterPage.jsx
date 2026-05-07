import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import FormField from "../../components/forms/FormField.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { registerSchema } from "../../utils/formSchemas.js";

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "user",
    },
  });

  const onSubmit = async ({ confirmPassword, role, ...values }) => {
    const data = await registerUser(values);
    navigate(data.user.role === "admin" ? "/admin-dashboard" : "/dashboard");
  };

  return (
    <section className="auth-layout">
      <div className="auth-hero auth-hero--secondary">
        <p className="eyebrow">Professional UI</p>
        <h1>Create your account and start tracking work the right way.</h1>
        <p>Admin accounts can manage the workspace, while users get a focused execution dashboard.</p>
      </div>

      <div className="auth-card">
        <h2>Create account</h2>
        <p className="muted-text">All fields are validated before submission.</p>

        <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Name" error={errors.name?.message}>
            <input {...register("name")} placeholder="Deepak Sharma" />
          </FormField>

          <FormField label="Email" error={errors.email?.message}>
            <input type="email" {...register("email")} placeholder="deepak@ethara.ai" />
          </FormField>

          <div className="form-row">
            <FormField label="Password" error={errors.password?.message}>
              <div className="password-input">
                <input type={showPassword ? "text" : "password"} {...register("password")} placeholder="••••••••" />
                <button type="button" className="icon-button" onClick={() => setShowPassword((current) => !current)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FormField>

            <FormField label="Confirm Password" error={errors.confirmPassword?.message}>
              <input type={showPassword ? "text" : "password"} {...register("confirmPassword")} placeholder="••••••••" />
            </FormField>
          </div>
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="footer-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;
