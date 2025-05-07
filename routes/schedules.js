const express = require("express");
const router = express.Router();

const fileMiddleware = require("../middleware/file");
const { auth } = require("../middleware/auth");
const { admin } = require("../middleware/admin");
const { create, getMyChedule, getAll } = require("../controllers/schedules");

router.post("/", auth, admin, fileMiddleware.single("file"), create);
router.get("/", auth, getMyChedule);
router.get("/all", auth, getAll);

module.exports = router;
