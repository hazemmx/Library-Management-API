const express = require("express");
const router = express.Router();
const borrowerController = require("./borrowers.controller");
const { loginLimiter } = require("../../middleware/rateLimit.middleware");

router.post("/", borrowerController.register);
router.post("/login", loginLimiter, borrowerController.login);
router.get("/", borrowerController.list);
router.put("/:id", borrowerController.update);
router.delete("/:id", borrowerController.remove);

module.exports = router;