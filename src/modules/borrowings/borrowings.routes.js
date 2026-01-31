const express = require("express");
const router = express.Router();
const controller = require("./borrowings.controller");
const authenticate = require("../../middleware/auth.middleware");
const { checkoutLimiter } = require("../../middleware/rateLimit.middleware");

router.post("/checkout", authenticate, checkoutLimiter, controller.checkout); // authenticate here
router.post("/return/:id", authenticate, controller.returnBook); // authenticate here
router.get("/my-books", authenticate, controller.getBorrowerBooks); // authenticate here
router.get("/overdue", controller.getOverdue);

module.exports = router;