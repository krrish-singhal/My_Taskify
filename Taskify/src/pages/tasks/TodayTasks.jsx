import { useEffect, useState } from "react";
import { useTask } from "../../contexts/TaskContext";
import { Plus, Clock } from 'lucide-react';
import TaskCard from "../../components/TaskCard";
import CreateTaskModal from "../../components/CreateTaskModal";

const TodayTasks = () => {
  const { fetchTodayTasks, loading } = useTask();
  const [tasks, setTasks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const result = await fetchTodayTasks();
    setTasks(result);
  };

  // Format today's date
  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-purple-500" />
            Today's Tasks
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{formatDate()}</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Task
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-12 h-12 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No tasks due today</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don't have any tasks scheduled for today. Enjoy your day or create a new task!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg inline-flex items-center hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Task
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateTaskModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default TodayTasks;
