import { CheckCircle2, FolderKanban, LoaderCircle, Users } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import EmptyState from "../../components/common/EmptyState.jsx";
import SkeletonCard from "../../components/common/SkeletonCard.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import useFetch from "../../hooks/useFetch.js";
import api from "../../services/api.js";
import { formatDateTime, relativeTime } from "../../utils/formatters.js";

const CHART_COLORS = ["#0f766e", "#f59e0b", "#dc2626"];

const AdminDashboardPage = () => {
  const { data, loading } = useFetch(async () => {
    const response = await api.get("/dashboard/admin");
    return response.data.data;
  });

  if (loading) {
    return (
      <div className="grid-cards">
        {[...Array(4)].map((_, index) => (
          <SkeletonCard key={index} className="h-120" />
        ))}
      </div>
    );
  }

  const isEmptyWorkspace =
    data.cards.totalUsers === 0 &&
    data.cards.totalProjects === 0 &&
    data.cards.completedTasks === 0 &&
    data.cards.pendingTasks === 0;

  return (
    <section className="page-stack">
      {isEmptyWorkspace ? (
        <EmptyState
          title="Workspace has no demo data yet"
          description="Run the backend seed script or create your first project and task from the admin account before taking screenshots."
        />
      ) : null}

      <div className="grid-cards">
        <StatCard icon={<Users size={20} />} label="Total Users" value={data.cards.totalUsers} accent="teal" />
        <StatCard
          icon={<FolderKanban size={20} />}
          label="Total Projects"
          value={data.cards.totalProjects}
          accent="amber"
        />
        <StatCard
          icon={<CheckCircle2 size={20} />}
          label="Completed Tasks"
          value={data.cards.completedTasks}
          accent="green"
        />
        <StatCard
          icon={<LoaderCircle size={20} />}
          label="Pending Tasks"
          value={data.cards.pendingTasks}
          accent="rose"
        />
      </div>

      <div className="dashboard-grid">
        <article className="panel">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Analytics</p>
              <h3>Task status breakdown</h3>
            </div>
          </div>
          <div className="chart-card">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={data.taskStatus} dataKey="value" nameKey="_id" outerRadius={90} innerRadius={50}>
                  {data.taskStatus.map((entry, index) => (
                    <Cell key={entry._id} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Progress</p>
              <h3>Project completion</h3>
            </div>
          </div>
          <div className="chart-card">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.projectProgress}>
                <XAxis dataKey="title" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="progress" fill="#0f172a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <div className="dashboard-grid">
        <article className="panel">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Recent tasks</p>
              <h3>Latest activity</h3>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {data.recentTasks.map((task) => (
                  <tr key={task._id}>
                    <td>{task.title}</td>
                    <td>{task.projectId?.title}</td>
                    <td>
                      <StatusBadge status={task.status} />
                    </td>
                    <td>{task.assignedTo?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Active users</p>
              <h3>Recent sessions</h3>
            </div>
          </div>
          <div className="activity-list">
            {data.activeUsers.map((user) => (
              <div key={user._id} className="activity-row">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?background=0F766E&color=fff&name=${user.name}`}
                  alt={user.name}
                />
                <div>
                  <strong>{user.name}</strong>
                  <p>{user.email}</p>
                </div>
                <span>{relativeTime(user.lastActiveAt)}</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="note-strip">Last dashboard refresh: {formatDateTime(new Date())}</div>
    </section>
  );
};

export default AdminDashboardPage;
