//Seleção de Elementos
const todoForm = document.querySelector("#todo-form")
const todoInput = document.querySelector("#todo-input")
const todoList = document.querySelector("#todo-list")
const editForm = document.querySelector("#edit-form")
const editInput = document.querySelector("#edit-input")
const cancelEditBtn = document.querySelector("#cancel-edit-btn")
const searchInput = document.querySelector("#search-input")
const filterSelect = document.querySelector("#filter-select")

let oldInputValue
let todos = []

const saveTodo = (text) => {
  const todo = document.createElement("div")
  todo.classList.add("todo")

  const todoTitle = document.createElement("h3")
  todoTitle.innerText = text
  todo.appendChild(todoTitle)

  const doneBtn = document.createElement("button")
  doneBtn.classList.add("check-todo")
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
  todo.appendChild(doneBtn)

  const editBtn = document.createElement("button")
  editBtn.classList.add("edit-todo")
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
  todo.appendChild(editBtn)

  const deleteBtn = document.createElement("button")
  deleteBtn.classList.add("remove-todo")
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
  todo.appendChild(deleteBtn)

  todoList.appendChild(todo)
  todos.push({ title: text, done: false })
  saveTodosToLocalStorage()
}

const toggleForms = () => {
  editForm.classList.toggle("hide")
  todoForm.classList.toggle("hide")
  todoList.classList.toggle("hide")
}

const updateTodo = (text) => {
  const todosEl = document.querySelectorAll(".todo")

  todosEl.forEach((todoEl, index) => {
    const todoTitle = todoEl.querySelector("h3")

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text
      todos[index].title = text
      saveTodosToLocalStorage()
    }
  })
}

const updateTodoStatus = (title) => {
  const todoIndex = todos.findIndex((todo) => todo.title === title)
  todos[todoIndex].done = !todos[todoIndex].done
  saveTodosToLocalStorage()
}

const removeTodo = (title) => {
  const todoIndex = todos.findIndex((todo) => todo.title === title)
  todos.splice(todoIndex, 1)
  saveTodosToLocalStorage()
}

const saveTodosToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos))
}

const loadTodosFromLocalStorage = () => {
  const todosStr = localStorage.getItem("todos")
  if (todosStr) {
    todos = JSON.parse(todosStr)
    todos.forEach((todo) => {
      saveTodo(todo.title)
      if (todo.done) {
        const todoEl = todoList.lastChild
        todoEl.classList.add("done")
      }
    })
  }
}

const filterTodos = () => {
  const filterValue = filterSelect.value

  todos.forEach((todo, index) => {
    const todoEl = todoList.children[index]

    if (filterValue === "done" && !todo.done) {
      todoEl.classList.add("hide")
    } else if (filterValue === "todo" && todo.done) {
      todoEl.classList.add("hide")
    } else {
      todoEl.classList.remove("hide")
    }
  })
}

const searchTodos = () => {
  const searchValue = searchInput.value.toLowerCase()

  todos.forEach((todo, index) => {
    const todoEl = todoList.children[index]
    const todoTitle = todoEl.querySelector("h3").innerText.toLowerCase()

    if (todoTitle.includes(searchValue)) {
      todoEl.classList.remove("hide")
    } else {
      todoEl.classList.add("hide")
    }
  })
}

// Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const inputValue = todoInput.value
  if (inputValue) {
    saveTodo(inputValue)
    todoInput.value = ""
    todoInput.focus()
  }
})

document.addEventListener("click", (e) => {
  const targetEl = e.target
  const parentEl = targetEl.closest("div")
  let todoTitle

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText || ""
  }

  if (targetEl.classList.contains("check-todo")) {
    parentEl.classList.toggle("done")
    updateTodoStatus(todoTitle)
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove()
    removeTodo(todoTitle)
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms()
    editInput.value = todoTitle
    oldInputValue = todoTitle
  }
})

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault()
  toggleForms()
})

editForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const editInputValue = editInput.value

  if (editInputValue) {
    updateTodo(editInputValue)
  }

  toggleForms()
})

// Evento de mudança no filtro
filterSelect.addEventListener("change", () => {
    filterTodos();
  });
  
  // Função de filtro
  const filtraTodos = () => {
    const filterValue = filterSelect.value;
  
    todos.forEach((todo, index) => {
      const todoEl = todoList.children[index];
  
      if (filterValue === "done" && !todo.done) {
        todoEl.classList.add("hide");
      } else if (filterValue === "todo" && todo.done) {
        todoEl.classList.add("hide");
      } else {
        todoEl.classList.remove("hide");
      }
    });
  };
searchInput.addEventListener("input", searchTodos)

filterSelect.addEventListener("change", filterTodos)

loadTodosFromLocalStorage()