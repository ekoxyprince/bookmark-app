const { BrowserWindow, ipcMain, session } = require("electron");
const StateManager = require("electron-window-state");
const path = require("path");
const readFile = require("../main/modules/readFile");
const appMenu = require("./menu/index");

const createMainWindow = function () {
  let windowState = StateManager({
    defaultHeight: 650,
    defaultWidth: 550,
  });
  let mainWindow = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    minWidth: 500,
    minHeight: 600,
    maxWidth: 550,
    maxHeight: 650,
    x: windowState.x,
    y: windowState.height,
    webPreferences: {
      preload: path.join(process.cwd(), "src", "preload", "index.js"),
    },
  });
  appMenu(mainWindow);
  mainWindow.on("close", () => {
    mainWindow = null;
  });
  mainWindow.webContents.openDevTools({ mode: "undocked" });
  console.log(session.defaultSession);
  mainWindow.loadFile(path.join(process.cwd(), "public", "main.html"));
  ipcMain.on("new-item", (event, item) => {
    readFile(item.url, (data) => {
      event.sender.send("item-sent-successfully", data);
    });
  });
};

module.exports = createMainWindow;
