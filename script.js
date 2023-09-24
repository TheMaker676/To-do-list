const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')
const tasksContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]')
const taskCompleted = document.querySelector('[data-task-completed]')

const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)
// "testing tally counter"
// let valueDisplay = document.querySelectorAll(".num");
// let interval = 4000;

listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId
    saveAndRender()
  }
})

tasksContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find(list => list.id === selectedListId)
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
    selectedTask.complete = e.target.checked
    save()
    renderTaskCount(selectedList)
  }
})

clearCompleteTasksButton.addEventListener('click', e => {
  const selectedList = lists.find(list => list.id === selectedListId)
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
  saveAndRender()
})

deleteListButton.addEventListener('click', e => {
  lists = lists.filter(list => list.id !== selectedListId)
  selectedListId = null
  saveAndRender()
})

newListForm.addEventListener('submit', e => {
  e.preventDefault()
  const listName = newListInput.value
  if (listName == null || listName === '') return
  const list = createList(listName)
  newListInput.value = null
  lists.push(list)
  saveAndRender()
})

newTaskForm.addEventListener('submit', e => {
  e.preventDefault()
  const taskName = newTaskInput.value
  if (taskName == null || taskName === '') return
  const task = createTask(taskName)
  newTaskInput.value = null
  const selectedList = lists.find(list => list.id === selectedListId)
  selectedList.tasks.push(task)
  saveAndRender()
})

function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

function createTask(name) {
  return { id: Date.now().toString(), name: name, complete: false }
}

function saveAndRender() {
  save()
  render()
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

function render() {
  clearElement(listsContainer)
  renderLists()

  const selectedList = lists.find(list => list.id === selectedListId)
  if (selectedListId == null) {
    listDisplayContainer.style.display = 'none'
  } else {
    listDisplayContainer.style.display = ''
    listTitleElement.innerText = selectedList.name
    renderTaskCount(selectedList)
    clearElement(tasksContainer)
    renderTasks(selectedList)
  }
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true)
    const checkbox = taskElement.querySelector('input')
    checkbox.id = task.id
    checkbox.checked = task.complete
    const label = taskElement.querySelector('label')
    label.htmlFor = task.id
    label.append(task.name)
    tasksContainer.appendChild(taskElement)
  })
}

//  "Task count"
function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`
}


function renderLists() {
  lists.forEach(list => {
    const listElement = document.createElement('li')
    listElement.dataset.listId = list.id
    listElement.classList.add("list-name")
    listElement.innerText = list.name
    if (list.id === selectedListId) {
      listElement.classList.add('active-list')
    }
    listsContainer.appendChild(listElement)
  })
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

// "Test New Function"
function totalPoint(click) {
  const totalPoints = document.getElementById('totalPoints');
  const sumvalue = parseInt(totalPoints.innerText) + click;
  console.log(sumvalue + click);
  totalPoints.innerText = sumvalue;

  // avoids negatives
  if(sumvalue < 0) {
    totalPoints.innerText = 0;
  }

  //reset value
  if(click === 0) {
    totalPoints.innerText = 0; 
  }
}

function totalQpoint(click) {
  const totalQpoints = document.getElementById('totalQpoints');
  const sumvalue = parseInt(totalQpoints.innerText) + click;
  console.log(sumvalue + click);
  totalQpoints.innerText = sumvalue;

  // avoids negatives
  if(sumvalue < 0) {
    totalQpoints.innerText = 0;
  }

  //reset value
  if(click === 0) {
    totalQpoints.innerText = 0; 
  }
}
// taskCompleted.addEventListener('click', e => {
//   let count = 0;

// function increaseCount() {
//   count += 1;
//   document.getElementById("countValue").textContent = count;
// }

// document.getElementById("taskCompleted").addEventListener("click", increaseCount);
// document.getElementById("clearCompleteTasksButton").addEventListener("click", function () {
//   count = 0;
//   document.getElementById("countValue").textContent = count;
// });
// });

// part 2 of tally counter
// valueDisplay.forEach((valueDisplay) => {
//   let startValue = 0;
//   let endValue = parseInt(valueDisplay.getAttribute
//       ("data-val"));
//   let duration = Math.floor(interval / endValue);
//   let counter = setInterval(function () {
//       startValue += 1;
//       valueDisplay.textContent = startValue;
//       if (startValue == endValue) {
//           clearInterval(counter);
//       }
//   }, duration);
// });

render()