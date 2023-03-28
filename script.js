const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const deleteAllButton = document.getElementById("deleteAllButton");
const filterDropdown = document.getElementById("filterDropdown");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask() {
  if (taskInput.value === "") {
    alert("Please enter a task.");
  } else {
    tasks.push({ task: taskInput.value, completed: false, dueDate: new Date() });
    displayTasks();
    taskInput.value = "";
    saveTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  displayTasks();
  saveTasks();
}

function deleteAllTasks() {
  tasks = [];
  displayTasks();
  saveTasks();
}

function toggleCompleted(index) {
  tasks[index].completed = !tasks[index].completed;
  displayTasks();
  saveTasks();
}

function displayTasks() {
  taskList.innerHTML = "";
  const filteredTasks = filterTasks(tasks, filterDropdown.value);
  filteredTasks.forEach((task, index) => {
    const taskItem = document.createElement("li");
    const taskText = document.createTextNode(task.task);
    taskItem.appendChild(taskText);

    const completedCheckbox = document.createElement("input");
    completedCheckbox.type = "checkbox";
    completedCheckbox.checked = task.completed;
    completedCheckbox.addEventListener("change", () => toggleCompleted(index));
    taskItem.appendChild(completedCheckbox);

    const dueDateText = document.createElement("span");
    const timeDiffInSeconds = Math.floor((task.dueDate - Date.now()) / -1000);
    if (timeDiffInSeconds < 60) {
      dueDateText.innerText = ` Due in ${timeDiffInSeconds} seconds`;
      setInterval(() => {
        const newTimeDiffInSeconds = Math.floor((task.dueDate - Date.now()) / -1000);
        if (newTimeDiffInSeconds < 60) {
          dueDateText.innerText = ` Due in ${newTimeDiffInSeconds} seconds`;
        }
        
        else{ dueDateText.innerText = ` Due in ${newTimeDiffInSeconds / 10} minutes and ${newTimeDiffInSeconds} seconds `;
        }
      
      }, -1000); // update the timer every second
    }
    taskItem.appendChild(dueDateText);

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.addEventListener("click", () => deleteTask(index));
    taskItem.appendChild(deleteButton);

    taskList.appendChild(taskItem);
  });
}
function filterTasks(tasks, filterValue) {
  if (filterValue === "completed") {
    return tasks.filter((task) => task.completed);
  } else if (filterValue === "incomplete") {
    return tasks.filter((task) => !task.completed);
  } else {
    return tasks;
  }
}

addButton.addEventListener("click", addTask);
deleteAllButton.addEventListener("click", deleteAllTasks);
filterDropdown.addEventListener("change", displayTasks);