const state = {
    taskList: [],
};

// DOM Manipulations
const taskModal = document.querySelector(".task__modal__body");
const taskContent = document.querySelector('.task__content');


// to create a card on the home page
const htmlTaskContent = ({ id, title, description, type, url }) => `
    <div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
        <div class='card shadow-sm task__card'>
            <div class='card-header d-flex gap-2 justify-content-end task__card__header' >
                <button type='button' class='btn btn-outline-info mr-2' name=${id} onclick='editTask.apply(this, arguments)'>
                <i class='fa fa-pencil-alt' name='${id}'></i>
                </button>
                <button type='button' class='btn btn-outline-danger mr-2' name=${id} onclick='deleteTask.apply(this, arguments)'>
                <i class='fa fa-trash-alt' name='${id}'></i>
                </button>
            </div>
            <div class='card-body'>
                ${url
        ? `<img width='100%' src=${url} alt='card image here' class='card-image-top md-3 rounded-lg' />`
        : `<img width='100%' src="https://www.chanchao.com.tw/VietnamPrintPack/images/default.jpg" alt='card image here' class='card-image-top md-3 rounded-lg' />`
    }
                <h4 class='task__card__title'>${title}</h4>
                <p class='description trim-3-lines text-muted' data-gram_editor='false'>${description}</p>
                <div class='tags text-white d-flex flex-wrap'>
                    <span class='badge bg-primary m-1'>${type}</span>
                </div>
            </div>
            <div class='card-footer'>
                <button type='button' class='btn btn-outline-primary float-right' data-bs-toggle='modal' data-bs-target='#showTask' 
                id=${id}
                onclick='openTask.apply(this, arguments)'>Open Task</button>
            </div>
        </div>
    </div>
`;


// Dynamic Modals(Cards) on our home page

const htmlModalContent = ({ id, title, description, url }) => {
    const date = new Date(parseInt(id));
    return `
        <div id = ${id}>
        ${url
            ? `<img width='100%' src=${url} alt='card image here' class='img-fluid place__holder__image mb-3' />`
            : `<img width='100%' src="https://www.chanchao.com.tw/VietnamPrintPack/images/default.jpg" alt='card image here' class='img-fluid place__holder__image mb-3' />`
        }
        <strong class='text-sm text-muted'>Created on ${date.toDateString()}</strong>  
        <h2 class='my-3'>${title}</h2>
        <p class='lead'>${description}</p>
        </div>
    `;
};

//Updating LocalStorage

const updateLocalStorage = () => {
    localStorage.setItem("task", JSON.stringify({
        tasks: state.taskList,
    }));
};

// to get data or card on your ui from localStorage
const loadInitialData = () => {
    const localStorageCopy = JSON.parse(localStorage.task);
    if (localStorageCopy) state.taskList = localStorageCopy.tasks;

    state.taskList.map((cardData) => {
        taskContent.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
    });
};

const handleSubmit = (event) => {
    const id = `${Date.now()}`;
    const input = {
        url: document.getElementById("imageUrl").value,
        title: document.getElementById("taskTitle").value,
        type: document.getElementById("taskType").value,
        description: document.getElementById("taskDescription").value,
    };
    if (input.title === "" || input.type === "" || input.description === "") {
        return alert("Please fill all the fields");
    }
    taskContent.insertAdjacentHTML("beforeend", htmlTaskContent({
        ...input, id,
    }));
    state.taskList.push({ ...input, id });

    //update localStorage
    updateLocalStorage();
};

// Function for open Task
const openTask = (e) => {
    // pop up the current one
    if (!e) e = window.event;

    //find and open correct card
    const getTask = state.taskList.find(({ id }) =>
        id === e.target.id
    );
    taskModal.innerHTML = htmlModalContent(getTask);
};

//  Deleting a task 
const deleteTask = (e) => {
    if (!e) e = window.event;

    const targetId = e.target.getAttribute('name');
    //console.log(targetId);
    const type = e.target.tagName;
    //console.log(type);

    const removeTask = state.taskList.filter(({ id }) => id !== targetId);
    //console.log(removeTask);
    state.taskList = removeTask;
    updateLocalStorage();
    if(type === "BUTTON") {
        console.log(e.target.parentNode.parentNode.parentNode);
        return e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode.parentNode);
    }

    return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode.parentNode.parentNode);
};

const editTask = (e) => {
    if (!e) e = window.event;

    const targetId = e.target.id;
    const type = e.target.tagName;

    let parentNode;
    let taskTitle;
    let taskDescription;
    let taskType;
    let submitButton;

    if(type === "BUTTON") {
        parentNode = e.target.parentNode.parentNode;
    } else {
        parentNode = e.target.parentNode.parentNode.parentNode;
    }

    taskTitle = parentNode.childNodes[3].childNodes[3];
    taskDescription = parentNode.childNodes[3].childNodes[5];
    taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    submitButton = parentNode.childNodes[5].childNodes[1];

    taskTitle.setAttribute("contenteditable","true");
    taskDescription.setAttribute("contenteditable","true");
    taskType.setAttribute("contenteditable","true");
    submitButton.setAttribute("onclick","saveEdit.apply(this, arguments)");
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML = "Save Changes";
};

const saveEdit = (e) => {
    if(!e) e = window.event;

    const targetId = e.target.id;
    const parentNode = e.target.parentNode.parentNode;

    const taskTitle = parentNode.childNodes[3].childNodes[3];
    const taskDescription = parentNode.childNodes[3].childNodes[5];
    const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    const submitButton = parentNode.childNodes[5].childNodes[1];

    const updatedData = {
        taskTitle: taskTitle.innerHTML,
        taskDescription: taskDescription.innerHTML,
        taskType: taskType.innerHTML,
    };

    let stateCopy = state.taskList;
    stateCopy = stateCopy.map((task) => 
        task.id === targetId ?
        {
            id: task.id,
            title: updatedData.taskTitle,
            description: updatedData.taskDescription,
            type: updatedData.taskType,
            url: task.url,
        }
        : task
    );
    state.taskList = stateCopy;
    updateLocalStorage();
    taskTitle.setAttribute("contenteditable","false");
    taskDescription.setAttribute("contenteditable","false");
    taskType.setAttribute("contenteditable","false");
    submitButton.setAttribute("onclick","openTask.apply(this, arguments)");
    submitButton.setAttribute("data-bs-toggle","modal");
    submitButton.setAttribute("data-bs-target","#showTask");
    submitButton.innerHTML = "Open Task";
};

const searchTask = (e) => {
    if(!e) e = window.event;

    while(taskContent.firstChild) {
        taskContent.removeChild(taskContent.firstChild);
    }
    const resultData = state.taskList.filter(({title}) =>
        title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    resultData.map((cardData) => 
        taskContent.insertAdjacentHTML("beforeend",htmlTaskContent(cardData))
    );

}