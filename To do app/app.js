"use strict";

//getting HTML elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const numbers = document.getElementById("numbers");
const progress = document.getElementById("progress");

//load saved tasks 
let tasks = [];

try {
    const savedTasks = localStorage.getItem("todoTasks");
    const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];

    if(Array.isArray(parsedTasks)) {
        tasks = parsedTasks.filter(task => 
            task &&
            typeof task.text === "string" &&
            typeof task.completed === "boolean"
        );
    }
} catch (error) {
    console.error("Could not load saved tasks:", error);
}

//save tasks to local storage
const savedTasks = () => {
    try {
        localStorage.setItem("todoTasks", JSON.stringify(tasks));
    } catch(error) {
        console.error("Could not save tasks:", error);
    }
};

//add new tasks
const addTask = () => {
    const text = taskInput.value.trim();

    //prevent empty tasks
    if(text === "") {
        taskInput.focus();
        return;
    }

    //create a new task objective
    const newTask = {
        id: Date.now() + Math.random(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    //clear the input field
    taskInput.value = "";

    //save & display the updated tasks
    savedTasks();
    renderTasks();

    taskInput.focus();
};

//display tasks on the page
const renderTasks = () => {
    //clear existing list
    taskList.innerHTML = "";

    tasks.forEach(task => {
        //create a list item
        const li = document.createElement("li");

        //create a checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label",
            "Mark " + task.text + " as complete"
        );

        //update completion status
        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;

            savedTasks();
            renderTasks();
        });

        //create task description
        const span = document.createElement("span");
        span.textContent = task.text;

        if(task.completed) {
            span.style.textDecoration = "line-through";
            span.style.opacity = "0.6";
        }

        //create a delete button
        const deleteButton = document.createElement("buton");
        deleteButton.type = "button";
        deleteButton.textContent = "x";
        deleteButton.setAttribute(
            "aria-label",
            "Delete ", + task.text
        );

        //delete selected tasks
        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);

            savedTasks();
            renderTasks();
        });
        
    //add elements to the list item
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteButton);

    //add list item to the page
    taskList.appendChild(li);
    });
    //update task counter & progress bar
    updateProgress();
};

//update counter & progress bar
const updateProgress = () => {
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        task => task.completed
    ).length;

    //display completed tasks / total tasks
    numbers.textContent = `${completedTasks} / ${totalTasks}`;

    //calculate the percentage completed
    const percentage = totalTasks === 0
        ? 0 
        : (completedTasks / totalTasks) * 100;

    progress.style.width = `${percentage}%`;
};

// listen for form submission
taskForm.addEventListener("submit", event => {
    event.preventDefault();
    addTask();
});

// display saved tasks when app opens
renderTasks();