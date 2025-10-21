import express from 'express';
import { tasks } from './mock.js';

const PORT = 3000;
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Express server!');
});

app.post('/tasks', (req, res) => {
  const data = req.body;
  console.log(data);
  const ids = tasks.map((task) => task.id);
  console.log(tasks);
  const nextId = Math.max(...ids) + 1;
  const now = new Date();
  const newTask = {
    ...data,
    id: nextId,
    createdAt: now,
    updatedAt: now,
    isComplete: false,
  };
  tasks.push(newTask);
  res.status(201).send(newTask);
});

app.get('/tasks', (req, res) => {
  /** 쿼리 파라미터
   * - sort : 'oldest'인 경우 오래된 태스크 기준, 나머지 경우 새로운 태스크 기준
   * - count : 태스크 개수
   */
  const sort = req.query.sort;
  const count = req.query.count;
  console.log('sort:', sort);
  console.log('count:', count);
  const compareFn =
    sort === 'oldest'
      ? (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      : (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
  let newTasks = [...tasks].sort(compareFn);
  if (count) {
    newTasks = newTasks.slice(0, Number(count));
  }
  res.send(newTasks);
});

app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);
  if (task) {
    res.send(task);
  } else {
    res.status(404).send({ message: 'Cannot find given id' });
  }
});

app.patch('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);
  if (task) {
    Object.keys(req.body).forEach((key) => {
      task[key] = req.body[key];
    });
    task.updatedAt = new Date();
    res.send(task);
  } else {
    res.status(404).send({ message: 'Cannot find given id' });
  }
});

app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex !== -1) {
    const [deletedTask] = tasks.splice(taskIndex, 1);
    res.send(deletedTask);
  } else {
    res.status(404).send({ message: 'Cannot find given id' });
  }
});

app.listen(PORT, (err) => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`${err}`);
});
