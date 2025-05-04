import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTask } from "../contexts/TaskContext";
import { CheckCircle, Clock, AlertTriangle, ChevronRight, Plus } from 'lucide-react';
import TaskCard from "../components/TaskCard";
import CreateTaskModal from "../components/CreateTaskModal";

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    fetchTaskStats, 
    fetchTodayTasks, 
    fetchUpcomingTasks, 
    fetchOverdueTasks,
    stats, 
    loading 
  } = useTask();
  
  const [todayTasks, setTodayTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      await fetchTaskStats();
      
      const today = await fetchTodayTasks();
      setTodayTasks(today);
      
      const upcoming = await fetchUpcomingTasks();
      setUpcomingTasks(upcoming);
      
      const overdue = await fetchOverdueTasks();
      setOverdueTasks(overdue);
    };
    
    loadDashboardData();
  }, [fetchTaskStats, fetchTodayTasks, fetchUpcomingTasks, fetchOverdueTasks]);

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Welcome back, {user?.name || "Guest"}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your tasks today.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Task
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {/* Total Tasks */}
        <StatCard 
          title="Total Tasks" 
          value={stats?.total || 0} 
          icon={<UsersIcon />} 
          color="blue" 
        />

        {/* Completed Tasks */}
        <StatCard 
          title="Completed Tasks" 
          value={stats?.completed || 0} 
          icon={<CheckCircle className="w-5 h-5" />} 
          color="green" 
        />

        {/* Due Today */}
        <StatCard 
          title="Due Today" 
          value={stats?.dueToday || 0} 
          icon={<Clock className="w-5 h-5" />} 
          color="purple" 
        />

        {/* Overdue */}
        <StatCard 
          title="Overdue" 
          value={stats?.overdue || 0} 
          icon={<AlertTriangle className="w-5 h-5" />} 
          color="red" 
        />
      </div>

      {/* Task Sections */}
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <TaskSection 
          title="Due Today" 
          icon={<Clock className="w-5 h-5 mr-2 text-purple-500" />} 
          tasks={todayTasks} 
          link="/tasks/today" 
          loading={loading}
        />

        <TaskSection 
          title="Overdue" 
          icon={<AlertTriangle className="w-5 h-5 mr-2 text-red-500" />} 
          tasks={overdueTasks} 
          link="/tasks/overdue" 
          loading={loading}
        />
      </div>

      {/* Upcoming Tasks */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-500" />
            Upcoming Tasks
          </h3>
          <Link to="/tasks/upcoming" className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center">
            View all <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin"></div>
          </div>
        ) : upcomingTasks.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">No upcoming tasks. Time to plan ahead!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg inline-flex items-center hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingTasks.slice(0, 3).map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const bg = {
    blue: "bg-blue-100 dark:bg-blue-500",
    green: "bg-green-100 dark:bg-green-500",
    purple: "bg-purple-100 dark:bg-purple-500",
    red: "bg-red-100 dark:bg-red-500",
  };

  const text = {
    blue: "text-blue-500 dark:text-blue-100",
    green: "text-green-500 dark:text-green-100",
    purple: "text-purple-500 dark:text-purple-100",
    red: "text-red-500 dark:text-red-100",
  };

  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
      <div className={`p-3 mr-4 rounded-full ${bg[color]} ${text[color]}`}>{icon}</div>
      <div>
        <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{value}</p>
      </div>
    </div>
  );
};

const TaskSection = ({ title, icon, tasks, link, loading }) => (
  <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
    <div className="flex items-center justify-between mb-4">
      <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 flex items-center">
        {icon}
        {title}
      </h4>
      <Link to={link} className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center">
        View all <ChevronRight className="w-4 h-4 ml-1" />
      </Link>
    </div>

    {loading ? (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin"></div>
      </div>
    ) : tasks.length === 0 ? (
      <p className="text-gray-600 dark:text-gray-400">No tasks!</p>
    ) : (
      <div className="space-y-3">
        {tasks.slice(0, 3).map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    )}
  </div>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
  </svg>
);

export default Dashboard;
