import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import PriorityBadge from "../../components/common/PriorityBadge.jsx";
import SkeletonCard from "../../components/common/SkeletonCard.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import ProjectFormModal from "../../components/forms/ProjectFormModal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import useFetch from "../../hooks/useFetch.js";
import api from "../../services/api.js";
import { formatDate } from "../../utils/formatters.js";

const ProjectsPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const usersQuery = useFetch(async () => {
    const response = await api.get("/users");
    return response.data.data;
  }, user?.role === "admin");

  const projectsQuery = useFetch(async () => {
    const response = await api.get("/projects", {
      params: {
        search,
        priority,
        status,
      },
    });
    return response.data.data;
  }, true, [search, priority, status]);

  const projects = useMemo(() => projectsQuery.data || [], [projectsQuery.data]);

  const handleProjectSubmit = async (payload) => {
    if (editingProject) {
      await api.put(`/projects/${editingProject._id}`, payload);
    } else {
      await api.post("/projects", payload);
    }
    await projectsQuery.run();
  };

  const deleteProject = async () => {
    await api.delete(`/projects/${deleteTarget._id}`);
    toast.success("Project deleted");
    setDeleteTarget(null);
    await projectsQuery.run();
  };

  if (projectsQuery.loading) {
    return (
      <div className="grid-projects">
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
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects" />
          </div>
          <select value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option value="">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All statuses</option>
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          {user?.role === "admin" ? (
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                setEditingProject(null);
                setModalOpen(true);
              }}
            >
              <Plus size={16} />
              New project
            </button>
          ) : null}
        </div>
      </div>

      {projects.length ? (
        <div className="grid-projects">
          {projects.map((project) => (
            <article key={project._id} className="project-card">
              <div className="project-card__header">
                <div>
                  <p className="eyebrow">{project.status.replace("-", " ")}</p>
                  <h3>{project.title}</h3>
                </div>
                <PriorityBadge priority={project.priority} />
              </div>

              <p className="project-card__description">{project.description}</p>

              <div className="project-card__meta">
                <StatusBadge status={project.status} />
                <span>Due {formatDate(project.deadline)}</span>
              </div>

              <div className="avatar-list">
                {project.members.map((member) => (
                  <img
                    key={member._id}
                    src={member.avatar || `https://ui-avatars.com/api/?background=0F766E&color=fff&name=${member.name}`}
                    alt={member.name}
                    title={member.name}
                  />
                ))}
              </div>

              {user?.role === "admin" ? (
                <div className="card-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {
                      setEditingProject({
                        ...project,
                        deadline: project.deadline?.slice(0, 10),
                        members: project.members.map((member) => member._id),
                      });
                      setModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button type="button" className="danger-button" onClick={() => setDeleteTarget(project)}>
                    Delete
                  </button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No projects found"
          description={
            user?.role === "admin"
              ? "Create your first project or run the demo seed data before screenshots."
              : "No projects are linked to your account yet. Ask the admin to add you as a project member."
          }
          action={
            user?.role === "admin" ? (
              <button type="button" className="primary-button" onClick={() => setModalOpen(true)}>
                Create project
              </button>
            ) : null
          }
        />
      )}

      <ProjectFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        users={usersQuery.data || []}
        initialValues={editingProject}
        onSubmit={handleProjectSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete project"
        description="This also removes tasks attached to the project. Please confirm carefully."
        onClose={() => setDeleteTarget(null)}
        onConfirm={deleteProject}
      />
    </section>
  );
};

export default ProjectsPage;
