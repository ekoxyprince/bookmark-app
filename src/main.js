const createMainWindow = require("./screens/main/index");
const { app } = require("electron");

app.on("ready", createMainWindow);
