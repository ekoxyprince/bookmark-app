const { BrowserWindow } = require("electron");

let offScreenWindow;

module.exports = (url, cb) => {
  offScreenWindow = new BrowserWindow({
    width: 250,
    height: 250,
    show: false,
    webPreferences: {
      offscreen: true,
    },
  });
  offScreenWindow.loadURL(url);
  offScreenWindow.webContents.on("did-finish-load", () => {
    let title = offScreenWindow.webContents.getTitle();
    offScreenWindow.webContents.capturePage().then((image) => {
      let screenshot = image.toDataURL();
      cb({ title, screenshot, url });
    });
    offScreenWindow.close();
    offScreenWindow = null;
  });
};
