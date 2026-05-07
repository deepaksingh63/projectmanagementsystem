import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "../common/Modal.jsx";
import FormField from "./FormField.jsx";
import { taskSchema } from "../../utils/formSchemas.js";

const TaskFormModal = ({ open, onClose, onSubmit, users, projects, initialValues, isAdmin }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: initialValues || {
      title: "",
      description: "",
      assignedTo: "",
      priority: "medium",
      status: "pending",
      dueDate: "",
      projectId: "",
    },
  });

  useEffect(() => {
    reset(
      initialValues || {
        title: "",
        description: "",
        assignedTo: "",
        priority: "medium",
        status: "pending",
        dueDate: "",
        projectId: "",
      }
    );
  }, [initialValues, reset]);

  const submit = async (values) => {
    await onSubmit(values);
    toast.success(initialValues ? "Task updated" : "Task created");
    onClose();
  };

  return (
    <Modal open={open} title={initialValues ? "Update task" : "Create task"} onClose={onClose}>
      <form className="form-grid" onSubmit={handleSubmit(submit)}>
        <FormField label="Title" error={errors.title?.message}>
          <input {...register("title")} placeholder="Prepare API integration deck" />
        </FormField>

        <FormField label="Description" error={errors.description?.message}>
          <textarea {...register("description")} rows="4" placeholder="Add delivery notes and blockers here" />
        </FormField>

        <div className="form-row">
          <FormField label="Due date" error={errors.dueDate?.message}>
            <input type="date" {...register("dueDate")} />
          </FormField>

          <FormField label="Project" error={errors.projectId?.message}>
            <select {...register("projectId")} disabled={!isAdmin && Boolean(initialValues)}>
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="form-row">
          <FormField label="Priority" error={errors.priority?.message}>
            <select {...register("priority")}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </FormField>

          <FormField label="Status" error={errors.status?.message}>
            <select {...register("status")}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </FormField>
        </div>

        <FormField label="Assign to" error={errors.assignedTo?.message}>
          <select {...register("assignedTo")} disabled={!isAdmin && Boolean(initialValues)}>
            <option value="">Select user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </FormField>

        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialValues ? "Update task" : "Create task"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskFormModal;
