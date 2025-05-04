import { createContext, useState, useContext, useCallback, useEffect } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";

const TaskContext = createContext();

export const useTask = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch task statistics
  const fetchTaskStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/tasks/stats");
      setStats(response.data.stats);
      return response.data.stats;
    } catch (error) {
      console.error("Error fetching task stats:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all tasks with optional filters
  const fetchTasks = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });

      const response = await axios.get(`/api/tasks?${queryParams.toString()}`);
      setTasks(response.data.tasks);
      return response.data.tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError(error.response?.data?.message || "Failed to fetch tasks");
      toast.error(error.response?.data?.message || "Failed to fetch tasks");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single task by ID
  const fetchTask = useCallback(async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/tasks/${taskId}`);
      setCurrentTask(response.data.task);
      return response.data.task;
    } catch (error) {
      console.error("Error fetching task:", error);
      setError(error.response?.data?.message || "Failed to fetch task");
      toast.error(error.response?.data?.message || "Failed to fetch task");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new task
  const createTask = useCallback(async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post("/api/tasks", taskData);
      setTasks((prevTasks) => [response.data.task, ...prevTasks]);
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

  // Update a task
  const updateTask = useCallback(async (taskId, taskData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(`/api/tasks/${taskId}`, taskData);
      
      // Update tasks list if it exists
      setTasks((prevTasks) => 
        prevTasks.map((task) => 
          task._id === taskId ? response.data.task : task
        )
      );
      
      // Update current task if it's the one being edited
      if (currentTask && currentTask._id === taskId) {
        setCurrentTask(response.data.task);
      }
      
      toast.success("Task updated successfully");
      return response.data.task;
    } catch (error) {
      console.error("Error updating task:", error);
      setError(error.response?.data?.message || "Failed to update task");
      toast.error(error.response?.data?.message || "Failed to update task");
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentTask]);

  // Delete a task
  const deleteTask = useCallback(async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
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

  // Add a subtask to a task
  const addSubtask = useCallback(async (taskId, title) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`/api/tasks/${taskId}/subtasks`, { title });
      
      // Update tasks list if it exists
      setTasks((prevTasks) => 
        prevTasks.map((task) => 
          task._id === taskId ? response.data.task : task
        )
      );
      
      // Update current task if it's the one being edited
      if (currentTask && currentTask._id === taskId) {
        setCurrentTask(response.data.task);
      }
      
      toast.success("Subtask added successfully");
      return response.data.task;
    } catch (error) {
      console.error("Error adding subtask:", error);
      setError(error.response?.data?.message || "Failed to add subtask");
      toast.error(error.response?.data?.message || "Failed to add subtask");
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentTask]);

  // Update a subtask
  const updateSubtask = useCallback(async (taskId, subtaskId, completed) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(`/api/tasks/${taskId}/subtasks/${subtaskId}`, { completed });
      
      // Update tasks list if it exists
      setTasks((prevTasks) => 
        prevTasks.map((task) => 
          task._id === taskId ? response.data.task : task
        )
      );
      
      // Update current task if it's the one being edited
      if (currentTask && currentTask._id === taskId) {
        setCurrentTask(response.data.task);
      }
      
      toast.success("Subtask updated successfully");
      return response.data.task;
    } catch (error) {
      console.error("Error updating subtask:", error);
      setError(error.response?.data?.message || "Failed to update subtask");
      toast.error(error.response?.data?.message || "Failed to update subtask");
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentTask]);

  // Toggle task importance (star)
  const toggleImportant = useCallback(async (taskId, isImportant) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(`/api/tasks/${taskId}`, { 
        tags: isImportant 
          ? ['important'] 
          : [] 
      });
      
      // Update tasks list if it exists
      setTasks((prevTasks) => 
        prevTasks.map((task) => 
          task._id === taskId ? response.data.task : task
        )
      );
      
      // Update current task if it's the one being edited
      if (currentTask && currentTask._id === taskId) {
        setCurrentTask(response.data.task);
      }
      
      toast.success(isImportant ? "Task marked as important" : "Task unmarked as important");
      return response.data.task;
    } catch (error) {
      console.error("Error toggling importance:", error);
      setError(error.response?.data?.message || "Failed to update task");
      toast.error(error.response?.data?.message || "Failed to update task");
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentTask]);

  // Get tasks for today
  const fetchTodayTasks = useCallback(async () => {
    return fetchTasks({ dueDate: 'today' });
  }, [fetchTasks]);

  // Get upcoming tasks
  const fetchUpcomingTasks = useCallback(async () => {
    return fetchTasks({ dueDate: 'upcoming' });
  }, [fetchTasks]);

  // Get important tasks
  const fetchImportantTasks = useCallback(async () => {
    return fetchTasks({ tags: 'important' });
  }, [fetchTasks]);

  // Get completed tasks
  const fetchCompletedTasks = useCallback(async () => {
    return fetchTasks({ completed: true });
  }, [fetchTasks]);

  // Get overdue tasks
  const fetchOverdueTasks = useCallback(async () => {
    return fetchTasks({ dueDate: 'overdue' });
  }, [fetchTasks]);

  useEffect(() => {
    // Fetch task stats when the context is initialized
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
    fetchOverdueTasks
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export { TaskContext };
