const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let tasks = [];

addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();

    if(taskText === ""){
        alert("Digite uma tarefa!");
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    taskInput.value = "";
});

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach (task => {
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = task.text;

        if (task.completed) {
            span.classList.add("completed");
        }

        span.addEventListener("click", () => {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        });

        const editBtn = document.createElement ("button");
        editBtn.textContent = "✏️"
        
        editBtn.addEventListener("click", () =>{
            const input = document.createElement ("input");
            input.type = "text";
            input.value = task.text;

            li.replaceChild(input, span);
            input.focus();

            input.addEventListener("blur", () => {
                task.text = input.value.trim() || task.text;
                saveTasks();
                renderTasks();
            });

            input.addEventListener ("keydown", (e) => {
                if (e.key === "Enter"){
                    input.blur();
                }
            });
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";

        deleteBtn.addEventListener("click", () => {
            tasks = tasks.filter(t=> t.id !== task.id);
            saveTasks();
            renderTasks();
        });

        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks(){
    const storedTasks = localStorage.getItem("tasks");

    if(storedTasks){
        tasks = JSON.parse(storedTasks);
    }
}

loadTasks();
renderTasks();