let todo = JSON.parse(localStorage.getItem("todo")) || [];
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const completedCount = document.getElementById("completedCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");
const filterBtns = document.querySelectorAll(".filter-btn");

let currentFilter = "all";

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  addButton.addEventListener("click", addTask);
  todoInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTask();
    }
  });
  deleteButton.addEventListener("click", deleteAllTasks);

  filterBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      displayTasks();
    })
  );

  displayTasks();
});

function addTask() {
  const newTask = todoInput.value.trim();
  if (newTask !== "") {
    todo.push({ text: newTask, disabled: false });
    saveToLocalStorage();
    todoInput.value = "";
    displayTasks();
  }
}

function displayTasks() {
  todoList.innerHTML = "";
  let filteredTasks = todo;

  if (currentFilter === "active") {
    filteredTasks = todo.filter((t) => !t.disabled);
  } else if (currentFilter === "completed") {
    filteredTasks = todo.filter((t) => t.disabled);
  }

  filteredTasks.forEach((item, index) => {
    const li = document.createElement("li");
    li.classList.add("todo-container");

    const leftDiv = document.createElement("div");
    leftDiv.classList.add("task-left");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = item.disabled;
    checkbox.addEventListener("change", () => toggleTask(index));

    const taskText = document.createElement("p");
    taskText.id = `todo-${index}`;
    taskText.textContent = item.text;
    if (item.disabled) taskText.classList.add("disabled");
    taskText.addEventListener("click", () => editTask(index));

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(taskText);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";
    deleteBtn.classList.add("delete-task");
    deleteBtn.addEventListener("click", () => deleteTask(index, li));

    li.appendChild(leftDiv);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });

  todoCount.textContent = todo.length;
  completedCount.textContent = todo.filter((t) => t.disabled).length;
}

function editTask(index) {
  const todoItem = document.getElementById(`todo-${index}`);
  const existingText = todo[index].text;
  const inputElement = document.createElement("input");
  inputElement.type = "text";
  inputElement.value = existingText;

  todoItem.replaceWith(inputElement);
  inputElement.focus();

  inputElement.addEventListener("blur", function () {
    const updatedText = inputElement.value.trim();
    if (updatedText) {
      todo[index].text = updatedText;
      saveToLocalStorage();
    }
    displayTasks();
  });

  inputElement.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      inputElement.blur();
    }
  });
}

function toggleTask(index) {
  todo[index].disabled = !todo[index].disabled;
  saveToLocalStorage();
  displayTasks();
}

function deleteTask(index, li) {
  li.classList.add("fade-out");
  setTimeout(() => {
    todo.splice(index, 1);
    saveToLocalStorage();
    displayTasks();
  }, 400);
}

function deleteAllTasks() {
  const allTasks = document.querySelectorAll(".todo-container");
  allTasks.forEach((task, i) => {
    setTimeout(() => task.classList.add("fade-out"), i * 100);
  });

  setTimeout(() => {
    todo = [];
    saveToLocalStorage();
    displayTasks();
  }, allTasks.length * 100 + 400);
}

function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo));
}

