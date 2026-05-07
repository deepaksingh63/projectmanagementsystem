import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import FormField from "../../components/forms/FormField.jsx";
import api from "../../services/api.js";
import { forgotPasswordSchema } from "../../utils/formSchemas.js";

const ForgotPasswordPage = () => {
  const [resetToken, setResetToken] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const resetForm = useForm({
    defaultValues: {
      token: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    const { data } = await api.post("/auth/forgot-password", values);
    setResetToken(data.data.resetToken);
    toast.success("Reset token generated");
  };

  const onResetPassword = async (values) => {
    await api.post("/auth/reset-password", values);
    toast.success("Password reset successful");
    resetForm.reset();
  };

  return (
    <section className="auth-layout">
      <div className="auth-hero">
        <p className="eyebrow">Recovery</p>
        <h1>Forgot your password?</h1>
        <p>This flow is included to make the project feel more production-ready during evaluation.</p>
      </div>

      <div className="auth-card">
        <h2>Reset access</h2>
        <p className="muted-text">Enter your email to generate a temporary reset token.</p>

        <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Email" error={errors.email?.message}>
            <input type="email" {...register("email")} placeholder="user@ethara.ai" />
          </FormField>
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Generating..." : "Generate token"}
          </button>
        </form>

        {resetToken ? (
          <div className="token-card">
            <p className="eyebrow">Demo reset token</p>
            <code>{resetToken}</code>
          </div>
        ) : null}

        <form className="form-grid" onSubmit={resetForm.handleSubmit(onResetPassword)}>
          <FormField label="Reset token">
            <input {...resetForm.register("token")} placeholder="Paste generated token here" />
          </FormField>
          <FormField label="New password">
            <input type="password" {...resetForm.register("password")} placeholder="Enter new password" />
          </FormField>
          <button type="submit" className="secondary-button" disabled={resetForm.formState.isSubmitting}>
            {resetForm.formState.isSubmitting ? "Resetting..." : "Reset password"}
          </button>
        </form>

        <p className="footer-text">
          Back to <Link to="/login">login</Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
