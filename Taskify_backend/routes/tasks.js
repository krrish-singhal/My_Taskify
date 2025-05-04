const express = require("express")
const router = express.Router()
const taskController = require("../controller/taskController")
const { protect } = require("../middleware/authMiddleware")

// Apply protect middleware to all routes
router.use(protect)

// Get all tasks with filtering
router.get("/", taskController.getTasks)

// Get task statistics
router.get("/stats", taskController.getTaskStats)

// Get overdue tasks
router.get("/overdue", taskController.getOverdueTasks)

// Create a new task
router.post("/", taskController.createTask)

// Get, update, delete a task
router.get("/:id", taskController.getTask)
router.put("/:id", taskController.updateTask)
router.delete("/:id", taskController.deleteTask)

// Subtasks
router.post("/:id/subtasks", taskController.addSubtask)
router.put("/:id/subtasks/:subtaskId", taskController.updateSubtask)

module.exports = router
