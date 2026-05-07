import { CheckCircle2, Clock3, ListChecks, Sparkles } from "lucide-react";
import EmptyState from "../../components/common/EmptyState.jsx";
import SkeletonCard from "../../components/common/SkeletonCard.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import useFetch from "../../hooks/useFetch.js";
import api from "../../services/api.js";
import { formatDate, relativeTime } from "../../utils/formatters.js";

const UserDashboardPage = () => {
  const { data, loading } = useFetch(async () => {
    const response = await api.get("/dashboard/user");
    return response.data.data;
  });

  if (loading) {
    return (
      <div className="grid-cards">
        {[...Array(3)].map((_, index) => (
          <SkeletonCard key={index} className="h-120" />
        ))}
      </div>
    );
  }

  const myTaskCount = data.myTasks.length;
  const pendingCount = data.myTasks.filter((task) => task.status !== "completed").length;

  return (
    <section className="page-stack">
      <div className="grid-cards">
        <StatCard icon={<ListChecks size={20} />} label="My Tasks" value={myTaskCount} accent="teal" />
        <StatCard icon={<Clock3 size={20} />} label="Upcoming" value={data.upcomingDeadlines.length} accent="amber" />
        <StatCard
          icon={<CheckCircle2 size={20} />}
          label="Completed"
          value={data.completedTasks}
          accent="green"
        />
      </div>

      <div className="dashboard-grid">
        <article className="panel">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Assigned work</p>
              <h3>My tasks</h3>
            </div>
          </div>
          {data.myTasks.length ? (
            <div className="task-list">
              {data.myTasks.map((task) => (
                <article key={task._id} className="task-card">
                  <div>
                    <h4>{task.title}</h4>
                    <p>{task.projectId?.title}</p>
                  </div>
                  <StatusBadge status={task.status} />
                  <span>{formatDate(task.dueDate)}</span>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No tasks assigned"
              description="This usually means you are logged in with a new account. Use the seeded demo user or assign tasks from the admin panel first."
            />
          )}
        </article>

        <article className="panel">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Notifications</p>
              <h3>Latest updates</h3>
            </div>
          </div>
          {data.notifications.length ? (
            <div className="notification-list">
              {data.notifications.map((notification) => (
                <div key={notification.id} className="notification-card">
                  <Sparkles size={16} />
                  <div>
                    <strong>{notification.message}</strong>
                    <p>{relativeTime(notification.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Quiet for now"
              description={
                pendingCount
                  ? `You have ${pendingCount} open tasks and no fresh notifications.`
                  : "Once an admin assigns or updates tasks, notifications will start appearing here."
              }
            />
          )}
        </article>
      </div>
    </section>
  );
};

export default UserDashboardPage;
