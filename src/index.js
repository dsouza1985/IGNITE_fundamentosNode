const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.body;

  const user = users.find(user => user.username === username);

  if (!user) {
    response.status(400).json({ error: "User not found" });
  }

  request.user = user;

  next();
}

function verifyExistsTodo(request, response, next) {

  const { username } = request.body;

  const { id } = request.params;

  const user = users.find(user => user.username === username);

  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "todo not fond !" });
  } else {
    request.todo = todo;
    next();
  }
}


app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userAlreadyExists = users.some((user) => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({ "error": "User already exists" })
  }

  const id = uuidv4();

  users.push({
    id,
    name,
    username,
    todos: []
  });

  const user = users.find(user => user.username === username);

  console.log(user);

  return response.status(201).json({ id: user.id, name: user.name, username: user.username, todos: user.todos });

});

app.get("/users", (request, response) => {
  const { username } = request.body;

  const user = users.find(user => user.username === username);

  return response.json({ user });
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.body;

  const user = users.find(user => user.username === username);

  return response.json(user.todos).send();

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.body;

  const { title, deadline } = request.body;

  const user = users.find(user => user.username === username);

  const id = uuidv4();

  user.todos.push({
    id,
    title,
    done: false,
    deadline: new Date(deadline),
    create_at: new Date()
  });

  return response.status(201).json({ id, title, deadline });

});

app.put('/todos/:id', checksExistsUserAccount, verifyExistsTodo, (request, response) => {
  // Complete aqui
  const { username } = request.body;

  const { id } = request.params;

  const { title, deadline } = request.body;

  const user = users.find(user => user.username === username);

  const todo = user.todos.find(todo => todo.id === id);

  todo.title = title;

  todo.deadline = new Date(deadline);

  return response.json(todo).send();

});

app.patch('/todos/:id/done', checksExistsUserAccount, verifyExistsTodo, (request, response) => {
  // Complete aqui
  const { username } = request.body;

  const { id } = request.params;

  const user = users.find(user => user.username === username);

  const todo = user.todos.find(todo => todo.id === id);

  todo.done = true;

  return response.status(201).json(todo);

});

app.delete('/todos/:id', checksExistsUserAccount, verifyExistsTodo, (request, response) => {
  // Complete aqui

  const { username } = request.body;

  const { id } = request.params;

  const user = users.find(user => user.username === username);

  const todo = user.todos.find(todo => todo.id === id);

  user.todos.splice(todo, 1);

  return response.status(201).json(user.todos);

});

module.exports = app;