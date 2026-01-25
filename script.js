const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("prioritySelect");
const filterSelect = document.getElementById("filterPriority");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");

let tasks = [];

function loadTasks() {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (filterSelect.value !== "Todas") {
    filteredTasks = tasks.filter(
      (task) => task.priority === filterSelect.value,
    );
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = `${task.text} (${task.priority})`;

    if (task.priority === "Alta") {
      span.style.color = "red";
    } else if (task.priority === "Media") {
      span.style.color = "orange";
    } else {
      span.style.color = "green";
    }

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";

    editBtn.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = task.text;

      const select = document.createElement("select");
      ["Alta", "Media", "Baixa"].forEach((p) => {
        const option = document.createElement("option");
        option.value = p;
        option.textContent = p;
        if (p === task.priority) option.selected = true;
        select.appendChild(option);
      });

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "💾";

      li.innerHTML = "";
      li.appendChild(input);
      li.appendChild(select);
      li.appendChild(saveBtn);

      input.focus();

      function saveEdit() {
        task.text = input.value.trim() || task.text;
        task.priority = select.value;
        saveTasks();
        renderTasks();
      }
      saveBtn.addEventListener("click", saveEdit);

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") saveEdit();
      });
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";

    deleteBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

function addTask() {
  if (taskInput.value.trim() === "") return;

  const task = {
    text: taskInput.value,
    priority: prioritySelect.value,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  prioritySelect.value = "Media";
}

addTaskBtn.addEventListener("click", addTask);
filterSelect.addEventListener("change", renderTasks);

loadTasks();
renderTasks();
