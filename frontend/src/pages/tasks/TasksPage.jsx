import { MessageSquarePlus, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import PriorityBadge from "../../components/common/PriorityBadge.jsx";
import SkeletonCard from "../../components/common/SkeletonCard.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import TaskFormModal from "../../components/forms/TaskFormModal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import useFetch from "../../hooks/useFetch.js";
import api from "../../services/api.js";
import { formatDateTime } from "../../utils/formatters.js";

const TasksPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [commentDrafts, setCommentDrafts] = useState({});

  const usersQuery = useFetch(async () => {
    const response = await api.get("/users");
    return response.data.data;
  }, user?.role === "admin");

  const projectsQuery = useFetch(async () => {
    const response = await api.get("/projects");
    return response.data.data;
  });

  const tasksQuery = useFetch(async () => {
    const response = await api.get("/tasks", {
      params: {
        search,
        priority,
        status,
      },
    });
    return response.data.data;
  }, true, [search, priority, status]);

  const tasks = useMemo(() => tasksQuery.data || [], [tasksQuery.data]);

  const handleTaskSubmit = async (payload) => {
    if (editingTask) {
      await api.put(`/tasks/${editingTask._id}`, payload);
    } else {
      await api.post("/tasks", payload);
    }

    await tasksQuery.run();
  };

  const deleteTask = async () => {
    await api.delete(`/tasks/${deleteTarget._id}`);
    toast.success("Task deleted");
    setDeleteTarget(null);
    await tasksQuery.run();
  };

  const addComment = async (taskId) => {
    const message = commentDrafts[taskId]?.trim();
    if (!message) {
      toast.error("Comment cannot be empty");
      return;
    }

    await api.post(`/tasks/${taskId}/comments`, { message });
    setCommentDrafts((current) => ({ ...current, [taskId]: "" }));
    toast.success("Comment added");
    await tasksQuery.run();
  };

  if (tasksQuery.loading || projectsQuery.loading) {
    return (
      <div className="page-stack">
        {[...Array(3)].map((_, index) => (
          <SkeletonCard key={index} className="h-240" />
        ))}
      </div>
    );
  }

  return (
    <section className="page-stack">
      <div className="panel">
        <div className="filters-row">
          <div className="search-input">
            <Search size={16} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks" />
          </div>
          <select value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option value="">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          {user?.role === "admin" ? (
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                setEditingTask(null);
                setModalOpen(true);
              }}
            >
              <Plus size={16} />
              New task
            </button>
          ) : null}
        </div>
      </div>

      {tasks.length ? (
        <div className="task-board">
          {tasks.map((task) => (
            <article key={task._id} className="task-card task-card--detailed">
              <div className="task-card__header">
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.projectId?.title}</p>
                </div>
                <div className="task-card__badges">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
              </div>

              <p>{task.description || "No description provided yet."}</p>

              <div className="task-card__meta">
                <span>Assigned to: {task.assignedTo?.name}</span>
                <span>Due: {formatDateTime(task.dueDate)}</span>
              </div>

              <div className="comment-box">
                <div className="inline-row">
                  <strong>Comments</strong>
                  <span>{task.comments.length}</span>
                </div>
                <div className="comment-list">
                  {task.comments.slice(-3).map((comment) => (
                    <div key={comment._id || comment.createdAt} className="comment-item">
                      <strong>{comment.author?.name}</strong>
                      <p>{comment.message}</p>
                    </div>
                  ))}
                </div>
                <div className="comment-input">
                  <input
                    value={commentDrafts[task._id] || ""}
                    onChange={(event) =>
                      setCommentDrafts((current) => ({ ...current, [task._id]: event.target.value }))
                    }
                    placeholder="Add a quick update"
                  />
                  <button type="button" className="secondary-button" onClick={() => addComment(task._id)}>
                    <MessageSquarePlus size={16} />
                    Comment
                  </button>
                </div>
              </div>

              <div className="card-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setEditingTask({
                      ...task,
                      assignedTo: task.assignedTo?._id,
                      projectId: task.projectId?._id,
                      dueDate: task.dueDate?.slice(0, 10),
                    });
                    setModalOpen(true);
                  }}
                >
                  {user?.role === "admin" ? "Edit task" : "Update status"}
                </button>
                {(user?.role === "admin" || task.createdBy?._id === user?._id) && (
                  <button type="button" className="danger-button" onClick={() => setDeleteTarget(task)}>
                    Delete
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No tasks yet"
          description={
            user?.role === "admin"
              ? "Create your first task or run the demo seed data before recording the final demo."
              : "You do not have assigned tasks yet. Use the seeded user account or assign tasks from the admin panel first."
          }
          action={
            user?.role === "admin" ? (
              <button type="button" className="primary-button" onClick={() => setModalOpen(true)}>
                Create task
              </button>
            ) : null
          }
        />
      )}

      <TaskFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        users={user?.role === "admin" ? usersQuery.data || [] : [{ _id: user._id, name: user.name, role: user.role }]}
        projects={projectsQuery.data || []}
        initialValues={editingTask}
        onSubmit={handleTaskSubmit}
        isAdmin={user?.role === "admin"}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete task"
        description="This removes the task permanently from the project workflow."
        onClose={() => setDeleteTarget(null)}
        onConfirm={deleteTask}
      />
    </section>
  );
};

export default TasksPage;
