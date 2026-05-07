import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import FormField from "../../components/forms/FormField.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import useFetch from "../../hooks/useFetch.js";
import api from "../../services/api.js";
import { profileSchema } from "../../utils/formSchemas.js";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const usersQuery = useFetch(async () => {
    const response = await api.get("/users");
    return response.data.data;
  }, user?.role === "admin");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name || "",
      title: user?.title || "",
      avatar: user?.avatar || "",
    },
  });

  const onSubmit = async (values) => {
    const { data } = await api.put("/auth/profile", values);
    updateUser(data.data);
    toast.success("Profile updated");
  };

  const handleRoleUpdate = async (userId, role) => {
    await api.put(`/users/${userId}/role`, { role });
    toast.success("User role updated");
    await usersQuery.run();
  };

  const handleDeleteUser = async (userId) => {
    await api.delete(`/users/${userId}`);
    toast.success("User removed");
    await usersQuery.run();
  };

  return (
    <section className="page-stack">
      <div className="dashboard-grid">
        <article className="panel">
          <div className="panel__header">
            <div>
              <p className="eyebrow">My profile</p>
              <h3>Personal details</h3>
            </div>
          </div>

          <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Name" error={errors.name?.message}>
              <input {...register("name")} />
            </FormField>

            <FormField label="Title" error={errors.title?.message}>
              <input {...register("title")} placeholder="Frontend developer" />
            </FormField>

            <FormField label="Avatar URL" error={errors.avatar?.message}>
              <input {...register("avatar")} placeholder="https://example.com/avatar.png" />
            </FormField>

            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Save profile"}
            </button>
          </form>
        </article>

        {user?.role === "admin" ? (
          <article className="panel">
            <div className="panel__header">
              <div>
                <p className="eyebrow">User management</p>
                <h3>Workspace users</h3>
              </div>
            </div>

            <div className="activity-list">
              {(usersQuery.data || []).map((workspaceUser) => (
                <div key={workspaceUser._id} className="activity-row">
                  <img
                    src={
                      workspaceUser.avatar ||
                      `https://ui-avatars.com/api/?background=0F766E&color=fff&name=${workspaceUser.name}`
                    }
                    alt={workspaceUser.name}
                  />
                  <div>
                    <strong>{workspaceUser.name}</strong>
                    <p>{workspaceUser.email}</p>
                  </div>
                  <div className="user-actions">
                    <select
                      value={workspaceUser.role}
                      onChange={(event) => handleRoleUpdate(workspaceUser._id, event.target.value)}
                      disabled={workspaceUser._id === user?._id}
                    >
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleDeleteUser(workspaceUser._id)}
                      disabled={workspaceUser._id === user?._id}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ) : null}
      </div>
    </section>
  );
};

export default ProfilePage;
