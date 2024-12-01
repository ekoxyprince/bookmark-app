const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel, cb) => {
    ipcRenderer.on(channel, (event, data) => {
      cb(event, data);
    });
  },
});
