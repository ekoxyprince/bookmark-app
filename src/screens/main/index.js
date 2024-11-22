const { BrowserWindow } = require("electron");
const StateManager = require("electron-window-state");
const path = require("path");

const createMainWindow = function () {
  let windowState = StateManager({
    defaultHeight: 800,
    defaultWidth: 1024,
  });
  let mainWindow = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    minWidth: 900,
    minHeight: 700,
    x: windowState.x,
    y: windowState.height,
  });
  mainWindow.on("close", () => {
    mainWindow = null;
  });
  mainWindow.loadFile(path.join(process.cwd(), "public", "main.html"));
};

module.exports = createMainWindow;
