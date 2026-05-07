import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "../common/Modal.jsx";
import FormField from "./FormField.jsx";
import { projectSchema } from "../../utils/formSchemas.js";

const ProjectFormModal = ({ open, onClose, onSubmit, users, initialValues }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: initialValues || {
      title: "",
      description: "",
      deadline: "",
      priority: "medium",
      status: "planning",
      members: [],
    },
  });

  useEffect(() => {
    reset(
      initialValues || {
        title: "",
        description: "",
        deadline: "",
        priority: "medium",
        status: "planning",
        members: [],
      }
    );
  }, [initialValues, reset]);

  const submit = async (values) => {
    const payload = {
      ...values,
      members: Array.isArray(values.members) ? values.members : [values.members].filter(Boolean),
    };
    await onSubmit(payload);
    toast.success(initialValues ? "Project updated" : "Project created");
    onClose();
  };

  return (
    <Modal open={open} title={initialValues ? "Edit project" : "Create project"} onClose={onClose}>
      <form className="form-grid" onSubmit={handleSubmit(submit)}>
        <FormField label="Title" error={errors.title?.message}>
          <input {...register("title")} placeholder="Launch operations dashboard" />
        </FormField>

        <FormField label="Description" error={errors.description?.message}>
          <textarea {...register("description")} rows="4" placeholder="Describe scope, milestones and stakeholders" />
        </FormField>

        <div className="form-row">
          <FormField label="Deadline" error={errors.deadline?.message}>
            <input type="date" {...register("deadline")} />
          </FormField>
          <FormField label="Priority" error={errors.priority?.message}>
            <select {...register("priority")}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </FormField>
        </div>

        <div className="form-row">
          <FormField label="Status" error={errors.status?.message}>
            <select {...register("status")}>
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </FormField>

          <FormField label="Members">
            <select {...register("members")} multiple className="multi-select">
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialValues ? "Save changes" : "Create project"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectFormModal;
