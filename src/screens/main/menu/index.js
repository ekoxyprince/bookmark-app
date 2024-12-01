const { Menu, shell } = require("electron");

module.exports = () => {
  const template = [
    {
      label: "Items",
      subMenu: [],
    },
    {
      role: "editMenu",
    },
    {
      role: "windowMenu",
    },
    {
      label: "Help Center",
      subMenu: [
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
