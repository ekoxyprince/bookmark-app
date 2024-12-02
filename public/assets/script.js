const showModal = document.getElementById("show-modal");
const closeModal = document.getElementById("close-modal");
const modal = document.getElementById("modal");
const itemUrl = document.getElementById("url");
const addItem = document.getElementById("add-item");
const header = document.getElementsByTagName("header")[0];
const items = document.getElementById("items");
const noItem = document.getElementById("no-item");
const search = document.getElementById("search");

const addItemFunction = (item) => {
  const existingItems = JSON.parse(localStorage.getItem("items"));
  if (noItem.style.display !== "none") {
    noItem.style.display = "none";
  }
  const newItems = [...existingItems, item];
  localStorage.setItem("items", JSON.stringify(newItems));
  const itemNode = document.createElement("div");
  itemNode.classList.add("read-item");
  itemNode.addEventListener("click", selectItem);
  itemNode.innerHTML = `<img src="${item.screenshot}"/> <h2>${item.title}</h2>`;
  itemNode.setAttribute("data-url", item.url);
  items.appendChild(itemNode);
};

document.addEventListener("DOMContentLoaded", () => {
  const addedItems = localStorage.getItem("items");
  if (!addedItems) {
    localStorage.setItem("items", JSON.stringify([]));
  }
  const readItems = JSON.parse(addedItems);
  if (addedItems && readItems.length > 0) {
    for (let i = 0; i < readItems.length; i++) {
      const itemNode = document.createElement("div");
      itemNode.classList.add("read-item");
      itemNode.innerHTML = `<img src="${readItems[i].screenshot}"/> <h2>${readItems[i].title}</h2>`;
      itemNode.setAttribute("data-url", readItems[i].url);
      itemNode.addEventListener("click", selectItem);
      items.appendChild(itemNode);
    }
    noItem.style.display = "none";
  }
});
function filterSearch(q) {
  items.innerHTML = "";
  const existingItems = JSON.parse(localStorage.getItem("items"));
  const readItems = existingItems.filter(
    (i) => i.title.toLowerCase().includes(q) || i.url.toLowerCase().includes(q)
  );
  for (let i = 0; i < readItems.length; i++) {
    const itemNode = document.createElement("div");
    itemNode.classList.add("read-item");
    itemNode.innerHTML = `<img src="${readItems[i].screenshot}"/> <h2>${readItems[i].title}</h2>`;
    itemNode.setAttribute("data-url", readItems[i].url);
    items.appendChild(itemNode);
  }
}
function selectItem(e) {
  document
    .getElementsByClassName("read-item selected")[0]
    ?.classList.remove("selected");
  e.target.classList.add("selected");
}
window.ipcRenderer.on("item-sent-successfully", (e, data) => {
  closeModal.click();
  console.log(e, data);
  addItemFunction(data);
});
window.ipcRenderer.on("add-new-bookmark", (e, data) => {
  showModal.click();
});
window.ipcRenderer.on("read-selected-item", () => {
  handleEnterKey();
});
showModal.onclick = () => {
  modal.classList.toggle("add");
  itemUrl.focus();
};
closeModal.onclick = () => {
  modal.classList.remove("add");
};
search.oninput = () => {
  filterSearch(search.value);
};
addItem.onclick = () => {
  if (itemUrl.value) {
    const newItem = {
      url: itemUrl.value,
    };
    window.ipcRenderer.send("new-item", newItem);
  }
};
itemUrl.addEventListener("keyup", (e) => {
  if (e.key === "Enter") addItem.click();
});
document.addEventListener("scroll", (e) => {
  if (window.scrollY > 0) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
});
document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowUp":
      handleKeyUp();
      break;
    case "ArrowDown":
      handleKeyDown();
      break;
    case "Enter":
      handleEnterKey();
      break;
    case "Delete":
      handleDeleteKey();
      break;
  }
});
document.addEventListener("dblclick", handleEnterKey);
function handleKeyUp() {
  const currentItem = document.getElementsByClassName("read-item selected")[0];
  if (currentItem && currentItem.previousElementSibling) {
    const nextItem = currentItem.previousElementSibling;
    nextItem.classList.add("selected");
    currentItem.classList.remove("selected");
  }
}
function handleKeyDown() {
  const currentItem = document.getElementsByClassName("read-item selected")[0];
  if (currentItem && currentItem.nextElementSibling) {
    const nextItem = currentItem.nextElementSibling;
    nextItem.classList.add("selected");
    currentItem.classList.remove("selected");
  }
}
function handleEnterKey() {
  const currentItem = document.getElementsByClassName("read-item selected")[0];
  if (currentItem) {
    const contentUrl = currentItem.dataset.url;
    const proxyWindow = window.open(
      contentUrl,
      "",
      `
      maxWidth=2000,
      maxHeight=2000,
      nodeIntegration=no,
      contextIsolation=1`
    );
  }
}
function handleDeleteKey() {
  const currentItem = document.getElementsByClassName("read-item selected")[0];
  if (!currentItem) return;
  const totalItems = JSON.parse(localStorage.getItem("items"));
  const filteredItems = totalItems.filter(
    (i) => i.url != currentItem.dataset.url
  );
  localStorage.setItem("items", JSON.stringify(filteredItems));
  window.location.reload();
}
