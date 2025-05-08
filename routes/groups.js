const express = require("express");
const router = express.Router();

const { create, getAll } = require("../controllers/groups");

router.get("/", getAll);

module.exports = router;
