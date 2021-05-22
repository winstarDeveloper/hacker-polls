const express = require('express');
const appController = require('./../controllers/appController');
const authController = require('./../controllers/authController');

const appRouter = express.Router();

appRouter.route("/").get(appController.getHackersData).post(authController.protect, appController.addHacker);
appRouter.route("/:id").patch(authController.protect, appController.updateHacker).delete(authController.protect, appController.deleteHacker);
appRouter.route("/vote/:id").get(appController.castVote);
appRouter.route("/login").post(authController.login);

module.exports = appRouter;