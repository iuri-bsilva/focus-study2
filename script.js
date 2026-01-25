const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("prioritySelect");
const filterSelect = document.getElementById("filterPriority");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");
const filterStatus = document.getElementById("filterStatus");

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

  if (filterStatus.value === "Pendentes") {
    filteredTasks = filteredTasks.filter((task) => !task.completed);
  }

  if (filterStatus.value === "Concluidas") {
    filteredTasks = filteredTasks.filter((task) => task.completed);
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const span = document.createElement("span");
    span.textContent = `${task.text} (${task.priority})`;

    if (task.priority === "Alta") {
      span.style.color = "red";
    } else if (task.priority === "Media") {
      span.style.color = "orange";
    } else {
      span.style.color = "green";
    }

    if (task.completed) {
      span.style.textDecoration = "line-through";
      span.style.opacity = "0.6";
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
      li.appendChild(checkbox);
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
    completed: false,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  prioritySelect.value = "Media";
}

addTaskBtn.addEventListener("click", addTask);
filterSelect.addEventListener("change", renderTasks);
filterStatus.addEventListener("change", renderTasks);

loadTasks();
renderTasks();
