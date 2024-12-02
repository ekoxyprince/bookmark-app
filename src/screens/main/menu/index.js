const { Menu, shell } = require("electron");

module.exports = (appWin) => {
  const template = [
    {
      label: "Items",
      submenu: [
        {
          label: "Add New",
          accelerator: "CmdOrCtrl+O",
          click: () => {
            appWin.webContents.send("add-new-bookmark");
          },
        },
        {
          label: "Read Item",
          accelerator: "CmdOrCtrl+Enter",
          click: () => {
            appWin.webContents.send("read-selected-item");
          },
        },
      ],
    },
    {
      role: "editMenu",
    },
    {
      role: "windowMenu",
    },
    {
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click: () => {
            shell.openExternal(
              "https://github.com/ekoxyprince/bookmark-app#readme"
            );
          },
        },
      ],
    },
  ];
  if (process.platform == "darwin") template.unshift({ role: "appMenu" });
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};
