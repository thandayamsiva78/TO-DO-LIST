document.addEventListener("DOMContentLoaded", function () {
    const hoursSelected = document.getElementById("hour");
    const minutesSelected = document.getElementById("minute");
    const taskForm = document.getElementById("task-form");
    const taskDateInput = document.getElementById("date");

    hoursSelected.addEventListener("focus", populateHours);
    minutesSelected.addEventListener("focus", populateMinutes);

    taskDateInput.addEventListener("change", function () {
        const selectedDate = new Date(this.value);
        const currentDate = new Date();
        
        // Reset time to compare date only
        currentDate.setHours(0, 0, 0, 0);
        
        if (selectedDate < currentDate) {
            alert("Please select a future date.");
            this.value = ""; // Optional: Clear the input field
        }
    });

    function populateHours() {
        hoursSelected.innerHTML = "";
        for (let i = 1; i < 13; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.innerText = i;
            hoursSelected.appendChild(option);
        }
    }

    function populateMinutes() {
        minutesSelected.innerHTML = "";
        for (let i = 0; i < 60; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.innerText = i < 10 ? "0" + i : i;
            minutesSelected.appendChild(option);
        }
    }


    taskForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const taskTitle = document.getElementById("title").value;
        const taskDate = document.getElementById("date").value;
        const taskHour = document.getElementById("hour").value;
        const taskMinute = document.getElementById("minute").value;
        const taskAmpm = document.getElementById("ampm").value;
        const taskTime = `${taskHour}:${taskMinute} ${taskAmpm}`;
        const taskDescription = document.getElementById("description").value;
        const taskCategory = document.getElementById("category").value;
        const taskPriority = document.getElementById("priority").value;



        const taskData = {
            title: taskTitle,
            date: taskDate,
            time: taskTime,
            description: taskDescription,
            category: taskCategory,
            priority: taskPriority
        };

        checkDeadline(taskData);
        saveTaskToLocalStorage(taskData);
        buildContainer(taskTitle, taskDate, taskTime, taskDescription, taskCategory, taskPriority);
        callpoppupNotification();
        checkDeadline(taskData);

        this.reset();
    });


    function saveTaskToLocalStorage(taskData) {
        let tasks = localStorage.getItem("tasks");
        tasks = tasks ? JSON.parse(tasks) : [];
        tasks.push(taskData);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }


    function loadTasks() {
        let tasks = localStorage.getItem("tasks");
        if (tasks) {
            tasks = JSON.parse(tasks);
            tasks.forEach(task => {
                buildContainer(task.title, task.date, task.time, task.description, task.category, task.priority);
            });
        }
    }



    function buildContainer(taskTitle, taskDate, taskTime, taskDescription, taskCategory, taskPriority) {
        const taskContainer = document.getElementById("tasks-container");

        const container = document.createElement("div");
        const titleAndDeadline = document.createElement("div");
        const catogeryAndButtons = document.createElement("div");
        const deadline = document.createElement("div");
        const buttons = document.createElement("div");

        const title = document.createElement("h1");
        const date = document.createElement("p");
        const time = document.createElement("p");
        const description = document.createElement("p");
        const category = document.createElement("h1");
        const priority = document.createElement("h1");

        priority.className = "priority"

        switch (taskCategory) {
            case "Work":
                category.innerText = "💼 ";
                break;
            case "Personal":
                category.innerText = "👤 ";
                break;
            case "Study":
                category.innerText = "📚";
                break;
            default:
                category.innerText = "🏷";
        }

        switch (taskPriority) {
            case "High":
                priority.innerHTML = `&#9734;`.repeat(5);
                priority.style.color = "orangered";
                break;
            case "Medium":
                priority.innerHTML = `&#9734;`.repeat(3);
                priority.style.color = "orange";
                break;
            case "Low":
                priority.innerHTML = `&#9734;`.repeat(1);
                priority.style.color = "green";
                break;
            default:
                priority.innerHTML = "";
        }

        const taskDeleted = document.createElement("span");
        const taskCompleted = document.createElement("span");

        title.innerText = taskTitle;
        date.innerText = taskDate;
        time.innerText = taskTime;
        description.innerText = taskDescription;

        deadline.appendChild(date);
        deadline.appendChild(time);
        deadline.className = "deadline";
        titleAndDeadline.appendChild(title);
        titleAndDeadline.appendChild(deadline);
        titleAndDeadline.className = "titleAndDeadline";

        catogeryAndButtons.appendChild(category);
        catogeryAndButtons.appendChild(buttons);
        catogeryAndButtons.className = "catogeryAndButtons";

        taskCompleted.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`;
        taskCompleted.className = 'taskCompletedBtn';

        taskDeleted.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>`;
        taskDeleted.className = "taskDeletedBtn";

        buttons.appendChild(taskDeleted);
        buttons.appendChild(taskCompleted);
        buttons.className = "buttons";


        container.appendChild(titleAndDeadline);
        container.appendChild(description);
        container.appendChild(priority);
        container.appendChild(catogeryAndButtons);

        container.className = "divContainer"
        container.style.marginBottom = "3px"

        taskContainer.appendChild(container);


        taskDeleted.addEventListener("click", function () {
            taskContainer.removeChild(container);
        });

        taskCompleted.addEventListener("click", function () {
            title.style.textDecoration = "line-through";
            title.style.color = "gray";
            taskCompleted.disabled = true;
        });
    }

    function callpoppupNotification() {
        const popupBox = document.querySelector(".popup-box");
        popupBox.style.display = "flex";
        const taskContainer = document.getElementById("tasks-container");
        taskContainer.style.display = "none";

        setTimeout(() => {
            popupBox.style.display = "none";
        }, 3000);

        callClosePopupNotification();

    }



    function callClosePopupNotification() {
        const closeToggle = document.getElementById("closeToggle");
        closeToggle.addEventListener("click", function () {
            const popupNotification = document.querySelector(".popup-box");
            popupNotification.style.display = "none";

        });
    }


    const seeTask = document.getElementById("seeTask");
    seeTask.addEventListener("click", function () {
        const form = document.getElementById("task-form");
        form.style.display = "none";
        const taskContainer = document.getElementById("tasks-container");
        taskContainer.style.display = "block";
        const backBtn = document.getElementById("backBtn");
        backBtn.style.display = "block";
    })

    const backBtn = document.getElementById("backBtn");
    backBtn.addEventListener("click", function () {
        const form = document.getElementById("task-form");
        form.style.display = "block";
        const backBtn = document.getElementById("backBtn");
        backBtn.style.display = "none";
        const taskContainer = document.getElementById("tasks-container");
        taskContainer.style.display = "none";
    })

    function checkDeadline(taskData) {
        const currentDate = new Date();
        const taskDateTime = new Date(`${taskData.date} ${taskData.time}`);

        const timeDifference = taskDateTime - currentDate;
        const oneHourInMilliseconds = 60 * 60 * 1000;

        if (timeDifference <= oneHourInMilliseconds && timeDifference > 0) {
            const taskContainers = document.querySelectorAll(".divContainer");
            taskContainers.forEach(container => {
                if (container.querySelector("h1").innerText === taskData.title) {
                    container.style.backgroundColor = "#CE1D1DAE"; 
                    container.style.color = "white"; 
                }
            });
        }
    }

    loadTasks();

});
