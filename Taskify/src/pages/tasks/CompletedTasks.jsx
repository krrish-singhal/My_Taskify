import { useEffect, useState } from "react";
import { useTask } from "../../contexts/TaskContext";
import { CheckCircle } from 'lucide-react';
import TaskCard from "../../components/TaskCard";

const CompletedTasks = () => {
  const { fetchCompletedTasks, loading } = useTask();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const result = await fetchCompletedTasks();
    setTasks(result);
  };

  // Group tasks by completion date
  const groupTasksByDate = () => {
    const grouped = {};
    
    tasks.forEach(task => {
      if (!task.completedAt) return;
      
      const date = new Date(task.completedAt);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date,
          tasks: []
        };
      }
      
      grouped[dateKey].tasks.push(task);
    });
    
    // Sort dates (newest first)
    return Object.values(grouped).sort((a, b) => b.date - a.date);
  };

  const formatDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const groupedTasks = groupTasksByDate();

  return (
    <div className="py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 flex items-center">
          <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
          Completed Tasks
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Great job! You've completed {tasks.length} task{tasks.length !== 1 ? 's' : ''}.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-12 h-12 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No completed tasks</h3>
          <p className="text-gray-600 dark:text-gray-400">
            You haven't completed any tasks yet. Complete a task to see it here!
          </p>
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
    </div>
  );
};

export default CompletedTasks;
