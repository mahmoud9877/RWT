import { Router } from "express";
import * as taskController from "./task.controller.js";
import { auth } from "../../middleware/auth.js";
import * as validators from "./task.validation.js";
import { validation } from "../../middleware/validation.js";

const router = Router();

router.post(
  "/",
  auth(["admin"]),
  validation(validators.aSignTaskSchema, ["body"]),
  taskController.aSignTask
);

router.get('/',
  auth(['employee']),
  taskController.getTask)

router.get('/all',
  auth(['admin']),
  taskController.allTasks)

router.put(
  "/:id",
  auth(),
  // validation(validators.updateTaskSchema, ["body"]),
  taskController.updateTask
);

router.delete(
  "/:id",
  auth(["admin"]),
  taskController.deleteTask
);

export default router;
