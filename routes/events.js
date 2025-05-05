const express = require("express");
const router = express.Router();

const fileMiddleware = require("../middleware/file");
const { auth } = require("../middleware/auth");
const { admin } = require("../middleware/admin");
const { create, remove, getAll } = require("../controllers/events");

router.post("/", auth, admin, fileMiddleware.single("file"), create);
router.delete("/:id", auth, admin, remove);
router.get("/", getAll);


module.exports = router;
