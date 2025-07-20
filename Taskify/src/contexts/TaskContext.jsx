import { createContext, useState, useContext, useCallback, useEffect } from "react";
import axios from "../api/axios"; // Axios is preconfigured
import toast from "react-hot-toast";

const TaskContext = createContext();
export const useTask = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch stats
  const fetchTaskStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/tasks/stats");
      setStats(response.data.stats || {});
      return response.data.stats;
    } catch (error) {
      console.error("Error fetching task stats:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch tasks
  const fetchTasks = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });

      const response = await axios.get(`/api/tasks?${queryParams.toString()}`);
      setTasks(response.data.tasks || []);
      return response.data.tasks || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError(error.response?.data?.message || "Failed to fetch tasks");
      toast.error(error.response?.data?.message || "Failed to fetch tasks");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTask = useCallback(async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/tasks/${taskId}`);
      setCurrentTask(response.data.task || null);
      return response.data.task || null;
    } catch (error) {
      console.error("Error fetching task:", error);
      setError(error.response?.data?.message || "Failed to fetch task");
      toast.error(error.response?.data?.message || "Failed to fetch task");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post("/api/tasks", taskData);
      setTasks((prev) => [response.data.task, ...prev]);
      toast.success("Task created successfully");
      return response.data.task;
    } catch (error) {
      console.error("Error creating task:", error);
      setError(error.response?.data?.message || "Failed to create task");
      toast.error(error.response?.data?.message || "Failed to create task");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (taskId, taskData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(`/api/tasks/${taskId}`, taskData);
      const updatedTask = response.data.task;

      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? updatedTask : task))
      );

      if (currentTask?._id === taskId) {
        setCurrentTask(updatedTask);
      }

      toast.success("Task updated successfully");
      return updatedTask;
    } catch (error) {
      console.error("Error updating task:", error);
      setError(error.response?.data?.message || "Failed to update task");
      toast.error(error.response?.data?.message || "Failed to update task");
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentTask]);

  const deleteTask = useCallback(async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      toast.success("Task deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      setError(error.response?.data?.message || "Failed to delete task");
      toast.error(error.response?.data?.message || "Failed to delete task");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const addSubtask = useCallback(async (taskId, title) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`/api/tasks/${taskId}/subtasks`, { title });
      const updated = response.data.task;

      setTasks((prev) => prev.map((task) => (task._id === taskId ? updated : task)));
      if (currentTask?._id === taskId) setCurrentTask(updated);

      toast.success("Subtask added");
      return updated;
    } catch (error) {
      console.error("Add subtask error:", error);
      setError(error.response?.data?.message || "Failed to add subtask");
      toast.error(error.response?.data?.message || "Failed to add subtask");
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentTask]);

  const updateSubtask = useCallback(async (taskId, subtaskId, completed) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(`/api/tasks/${taskId}/subtasks/${subtaskId}`, { completed });
      const updated = response.data.task;

      setTasks((prev) => prev.map((task) => (task._id === taskId ? updated : task)));
      if (currentTask?._id === taskId) setCurrentTask(updated);

      toast.success("Subtask updated");
      return updated;
    } catch (error) {
      console.error("Update subtask error:", error);
      setError(error.response?.data?.message || "Failed to update subtask");
      toast.error(error.response?.data?.message || "Failed to update subtask");
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentTask]);

  const toggleImportant = useCallback(async (taskId, isImportant) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(`/api/tasks/${taskId}`, {
        tags: isImportant ? ["important"] : []
      });

      const updated = response.data.task;

      setTasks((prev) => prev.map((task) => (task._id === taskId ? updated : task)));
      if (currentTask?._id === taskId) setCurrentTask(updated);

      toast.success(isImportant ? "Marked as important" : "Unmarked as important");
      return updated;
    } catch (error) {
      console.error("Toggle importance error:", error);
      setError(error.response?.data?.message || "Failed to update task");
      toast.error(error.response?.data?.message || "Failed to update task");
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentTask]);

  // Filtered tasks
  const fetchTodayTasks = useCallback(() => fetchTasks({ dueDate: "today" }), [fetchTasks]);
  const fetchUpcomingTasks = useCallback(() => fetchTasks({ dueDate: "upcoming" }), [fetchTasks]);
  const fetchImportantTasks = useCallback(() => fetchTasks({ tags: "important" }), [fetchTasks]);
  const fetchCompletedTasks = useCallback(() => fetchTasks({ completed: true }), [fetchTasks]);
  const fetchOverdueTasks = useCallback(() => fetchTasks({ dueDate: "overdue" }), [fetchTasks]);

  useEffect(() => {
    fetchTaskStats();
  }, [fetchTaskStats]);

  const value = {
    tasks,
    currentTask,
    stats,
    loading,
    error,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    addSubtask,
    updateSubtask,
    toggleImportant,
    fetchTaskStats,
    fetchTodayTasks,
    fetchUpcomingTasks,
    fetchImportantTasks,
    fetchCompletedTasks,
    fetchOverdueTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export { TaskContext };
