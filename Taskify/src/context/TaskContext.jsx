import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import api from '../services/taskService';

const TaskContext = createContext();

export const useTask = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Fetch tasks when user or filters change
  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchTaskStats();
    }
  }, [user, filters]);

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
      
      const response = await api.get(`/tasks?${queryParams.toString()}`);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  // Fetch task statistics
  const fetchTaskStats = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await api.get('/tasks/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching task stats:', error);
    }
  }, [user]);

  // Fetch a single task
  const fetchTask = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/tasks/${id}`);
      setCurrentTask(response.data.task);
      return response.data.task;
    } catch (error) {
      console.error('Error fetching task:', error);
      toast.error('Failed to fetch task details');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create a new task
  const createTask = async (taskData) => {
    try {
      setLoading(true);
      const response = await api.post('/tasks', taskData);
      setTasks([response.data.task, ...tasks]);
      toast.success('Task created successfully');
      await fetchTaskStats();
      return response.data.task;
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update a task
  const updateTask = async (id, taskData) => {
    try {
      setLoading(true);
      const response = await api.put(`/tasks/${id}`, taskData);
      
      // Update tasks list
      setTasks(tasks.map(task => 
        task._id === id ? response.data.task : task
      ));
      
      // Update current task if it's the one being edited
      if (currentTask && currentTask._id === id) {
        setCurrentTask(response.data.task);
      }
      
      toast.success('Task updated successfully');
      await fetchTaskStats();
      return response.data.task;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      toast.success('Task deleted successfully');
      await fetchTaskStats();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Add a subtask
  const addSubtask = async (taskId, title) => {
    try {
      setLoading(true);
      const response = await api.post(`/tasks/${taskId}/subtasks`, { title });
      
      // Update tasks list
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data.task : task
      ));
      
      // Update current task if it's the one being edited
      if (currentTask && currentTask._id === taskId) {
        setCurrentTask(response.data.task);
      }
      
      toast.success('Subtask added successfully');
      return response.data.task;
    } catch (error) {
      console.error('Error adding subtask:', error);
      toast.error('Failed to add subtask');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update subtask status
  const updateSubtask = async (taskId, subtaskId, completed) => {
    try {
      setLoading(true);
      const response = await api.put(`/tasks/${taskId}/subtasks/${subtaskId}`, { completed });
      
      // Update tasks list
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data.task : task
      ));
      
      // Update current task if it's the one being edited
      if (currentTask && currentTask._id === taskId) {
        setCurrentTask(response.data.task);
      }
      
      return response.data.task;
    } catch (error) {
      console.error('Error updating subtask:', error);
      toast.error('Failed to update subtask');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      priority: '',
      category: '',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const value = {
    tasks,
    currentTask,
    stats,
    loading,
    filters,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    addSubtask,
    updateSubtask,
    updateFilters,
    resetFilters
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};