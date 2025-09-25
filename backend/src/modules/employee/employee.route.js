import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./employee.validation.js";
import * as eveEmployeeController from "./employee.controller.js";

const router = Router();

router.get("/",
  auth(['admin']),
  eveEmployeeController.getAllEveEmployee);


router.get("/user/:id",
  auth(['employee']),
  eveEmployeeController.getDataEmployee);


router.get(
  "/:id",
  auth(['admin']),
  validation(validators.employeeIdParam, ["params"]),
  eveEmployeeController.getEmployeeById
);

// 📌 Create employee
router.post(
  "/",
  auth(['admin']),
  // validation(validators.createEveEmployeeSchema, ["body"]),
  eveEmployeeController.createEveEmployee
);

// 📌 Update employee (validate :id + body)
router.patch(
  "/:id",
  auth(['admin']),
  // uploadImage.single("photoUrl"),
  validation(validators.employeeIdParam, ["params"]),
  validation(validators.updateEveEmployeeSchema, ["body"]),
  eveEmployeeController.updateEveEmployee
);

router.delete('/:id',
  auth(['admin']),
  eveEmployeeController.deleteEmployee
)

export default router;
