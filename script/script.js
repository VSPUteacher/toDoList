//Знаходимо елементи на сторінці
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

//Створюємо пустий масив (для збереженння даних після оновлення сторінки)
let tasks = [];

if(localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'));
}

tasks.forEach(function(task){
    renderTask(task);
})


checkEmptyList();

//Додавання задачі
form.addEventListener('submit', addTask);

//Видалення задачі
tasksList.addEventListener('click', deleteTask);

//відмічаємо задачу завершеною
tasksList.addEventListener('click', doneTask);


//Функції
function addTask(event){
    //відміняємо станартне оновлення сторінки
    event.preventDefault();

    //дістаємо текст задачі з поля ввода
    const taskText = taskInput.value

    //описуємо задачу у вигляді обєкта (для збереження даних після оновлення сторінки)
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    //добавляємо задачу в масив з задачами
    tasks.push(newTask)

    //Зберігаємо список задач в хранилище браузера Local Storage
    saveToLocalStorage();

    renderTask(newTask);

    //очищуємо поле ввода після ввода
    taskInput.value = ""
    taskInput.focus()

    checkEmptyList();
    
}

function deleteTask(event){

    //перевіряємо що клік був НЕ по кнопці "видалити задачу"
    if (event.target.dataset.action !== 'delete')return;

    //перевіряємо що клік був по кнопці "видалити задачу"
       const parentNode = event.target.closest('.list-group-item');
    
    //оприділяємо ID задачі
    const id = Number(parentNode.id);
    
    //видаляємо через фільтрацію масива
    tasks = tasks.filter((task) => task.id !==id);

    
    //Зберігаємо список задач в хранилище браузера Local Storage
    saveToLocalStorage();

    //видаляємо задачу із розмітки   
       parentNode.remove()

       checkEmptyList();
    
}

function doneTask(event){
    //перевіряємо що клік був по нЕ ПО кнопці "задача виконана"
    if(event.target.dataset.action !== "done") return;

    //перевіряємо що клік був по кнопці "задача виконана"
        const parentNode = event.target.closest('.list-group-item');
  
        const id = Number(parentNode.id);
        const task = tasks.find((task) => task.id === id)
        task.done = !task.done;

        
        //Зберігаємо список задач в хранилище браузера Local Storage
        saveToLocalStorage();

        const taskTitle = parentNode.querySelector('.task-title');
        taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList(){
    if(tasks.length === 0){
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
    </li> `;

    tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if(tasks.length > 0){
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task){
    //формуємо css клас
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';


    //формуємо розмітку для нової задачі *div з Купити молоко*
    const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${task.text}</span>
    <div class="task-item__buttons">
        <button type="button" data-action="done" class="btn-action">
            <img src="./img/tick.svg" alt="Done" width="18" height="18">
        </button>
        <button type="button" data-action="delete" class="btn-action">
            <img src="./img/cross.svg" alt="Done" width="18" height="18">
        </button>
    </div>
    </li>`;

    //добавляємо задачу на сторінку
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
