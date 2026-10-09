import { Router } from 'express';
import {
    getAllTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask
} from '../controllers/taskController.js';

const router = Router();

// /api/tasks
router.route('/')
    .get(getAllTasks)
    .post(createTask);

// /api/tasks/:id
router.route('/:id')
    .get(getTaskById)
    .patch(updateTask)
    .delete(deleteTask);

export default router;