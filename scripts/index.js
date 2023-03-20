const state = {
    taskList: [],
};

// DOM Manipulations
const taskModel = document.querySelector(".task__modal__body");
//console.log(taskModel);
const taskContent = document.querySelector('.task__content');


// to create a card on the home page
const htmlTaskContent = (id, title, description, type, url) => `
    <div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
        <div class='card shadow-sm task__card'>
            <div class='card-header d-flex justify-content-end task__card__header' >
                <button type='button' class='btn btn-outline-info mr-2' name=${id}>
                <i class='fa fa-pencil-alt' name='${id}'></i>
                </button>
                <button type='button' class='btn btn-outline-danger mr-2' name=${id}>
                <i class='fa fa-trash-alt' name='${id}'></i>
                </button>

                <div class='card-body'>
                    ${
                        url && `<img width='100%' src=${url} alt='card image here' class='card-image-top md-3 rounded-lg' />`
                    }
                    <h4 class='task__card__title'>${title}</h4>
                    <p class='description trim-3-lines text-muted' data-gram-editor='false'>${description}</p>
                    <div class='tags text-white d-flex flex-wrap'>
                        <span class='badge bg-primary m-1'>${type}</span>
                    </div>
                </div>
                <div class='card-footer'>
                <button type='button' class='btn btn-outline-primary float-right' data-bs-toggle='modal' data-bs-target='showTask'>Show Task</button>
                </div>
            </div>
        </div>
    </div>
`;


// Dynamic Modals(Cards) on our home page

const htmlModalContent = ({id, title, description, type, url}) => {
    const date = new Date(parseInt(id));
    return `
        <div id=${id}>
        ${
            url && `<img width='100%' src=${url} alt='card image here' class='img-fluid place__holder__image mb-3' />`
        }
        <strong class='text-sm text-muted'>Created on ${date.toDateString()}</strong>  
        <h2 class='my-3'>${title}</h2>
        <p class='lead'>${description}</p>
        <span class='badge bg-primary m-1'>${type}</span>
        </div>
    `;
};

//Updating LocalStorage

const updateLocalStorage = () => {
    localStorage.setItem('task',JSON.stringify({
        tasks:state.taskList,
    }));
};

// to get data or card on your ui from localStorage
const loadInitialData = () => {
    const localStorageCopy = JSON.parse(localStorage.task);
    if(localStorageCopy) state.taskList = localStorageCopy.task;

    state.taskList.map((cardData) => {
        taskContent.insertAdjacentHTML("beforeend",htmlTaskContent(cardData));
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
    if(input.title == '' || input.type == '' || input.description == '') {
        return alert("Please fill all the fields");
    }
    taskContent.insertAdjacentHTML("beforeend",htmlTaskContent({
        ...input,id,
    }));
    state.taskList.push({...input,id});

    //update localStorage
    updateLocalStorage();
};