let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editIndex = null;

// Event listener for adding or updating a task
document.getElementById("taskForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;

  if (!title || !dueDate || !priority) {
    alert("Please fill in the title, due date, and priority.");
    return;
  }

  const task = {
    id: editIndex !== null ? tasks[editIndex].id : Date.now(),
    title,
    description,
    dueDate,
    priority
  };

  if (editIndex !== null) {
    tasks[editIndex] = task;
    editIndex = null;
  } else {
    tasks.push(task);
  }

  saveAndDisplay();
  clearForm();
});

// Display tasks on the page, optionally filtered by priority
function displayTasks(filter = "all") {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  let filteredTasks = filter === "all"
    ? tasks
    : tasks.filter(task => task.priority === filter);

  filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task";

    li.innerHTML = `
      <strong>${task.title}</strong>
      <div class="meta">${task.description}</div>
      <div class="meta">Due: ${task.dueDate}</div>
      <div class="priority-badge priority-${task.priority}">${task.priority.toUpperCase()}</div>
      <div style="margin-top: 10px;">
        <button onclick="editTask(${index})"><i class="fa-solid fa-pen-to-square"></i></button>
        <button onclick="deleteTask(${index})"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

// Edit an existing task
function editTask(index) {
  const task = tasks[index];
  document.getElementById("title").value = task.title;
  document.getElementById("description").value = task.description;
  document.getElementById("dueDate").value = task.dueDate;
  document.getElementById("priority").value = task.priority;
  editIndex = index;
}

// Delete a task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveAndDisplay();
}

// Save to local storage and refresh the task list
function saveAndDisplay() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  const selectedFilter = document.getElementById("filterPriority").value;
  displayTasks(selectedFilter);
}

// Clear form inputs
function clearForm() {
  document.getElementById("taskForm").reset();
  editIndex = null;
}

// Filter change event
document.getElementById("filterPriority").addEventListener("change", function () {
  displayTasks(this.value);
});

// Initialize on load
window.onload = () => {
  displayTasks();
};
