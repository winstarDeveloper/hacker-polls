const express = require("express");
const app = express();
const cors = require('cors');
const appRouter = require('./routes/appRoutes');
const globalErrorHandler = require('./controllers/errorController');

// enable cors
app.use(cors());

// Body parser, reading data from body into req.body
app.use(express.json());

// Set route paths
app.use("/api/v1/hackers", appRouter);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

app.use(globalErrorHandler);

module.exports = app;
