const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors({ origin: "*" }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/users", require("./routes/users"));
app.use("/api/schedules", require("./routes/schedules"));
app.use("/api/groups", require("./routes/groups"));
app.use("/api/events", require("./routes/events"));

module.exports = app;
