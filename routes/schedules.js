const express = require("express");
const router = express.Router();

const fileMiddleware = require("../middleware/file");
const { auth } = require("../middleware/auth");
const { admin } = require("../middleware/admin");
const {
  create,
  getMyChedule,
  getAll,
  remove,
} = require("../controllers/schedules");

router.post("/", auth, admin, fileMiddleware.single("file"), create);
router.get("/", auth, getMyChedule);
router.get("/all", auth, getAll);
router.delete("/:id", auth, remove);

module.exports = router;
