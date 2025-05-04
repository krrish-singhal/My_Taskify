import { useEffect, useState } from "react";
import { useTask } from "../../contexts/TaskContext";
import { Plus, Calendar } from 'lucide-react';
import TaskCard from "../../components/TaskCard";
import CreateTaskModal from "../../components/CreateTaskModal";

const UpcomingTasks = () => {
  const { fetchUpcomingTasks, loading } = useTask();
  const [tasks, setTasks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const result = await fetchUpcomingTasks();
    setTasks(result);
  };

  // Group tasks by date
  const groupTasksByDate = () => {
    const grouped = {};
    
    tasks.forEach(task => {
      if (!task.dueDate) return;
      
      const date = new Date(task.dueDate);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date,
          tasks: []
        };
      }
      
      grouped[dateKey].tasks.push(task);
    });
    
    // Sort dates
    return Object.values(grouped).sort((a, b) => a.date - b.date);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const groupedTasks = groupTasksByDate();

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-purple-500" />
            Upcoming Tasks
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Tasks scheduled for the future</p>
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
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No upcoming tasks</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don't have any tasks scheduled for the future. Plan ahead by creating a new task!
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
        <div className="space-y-8">
          {groupedTasks.map((group) => (
            <div key={group.date.toISOString()} className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 border-b pb-2 dark:border-gray-700">
                {formatDate(group.date)}
              </h3>
              <div className="space-y-4">
                {group.tasks.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateTaskModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default UpcomingTasks;
