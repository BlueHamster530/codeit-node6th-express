import express from 'express';
import data from './seedData.js';
import Task from './task.js';
import mongoose from 'mongoose';
import { DATABASE_URL } from './constants.js';
import cors from 'cors';

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());

await mongoose.connect(DATABASE_URL);

app.post('/tasks', async (req, res) => {
  const newTask = await Task.create(req.body);
  res.status(201).send(newTask);
});

app.post('/tasks', (req, res) => {
  const data = req.body;
  console.log(data);
  const _ids = data.map((task) => task._id);
  console.log(tasks);
  const next_id = Math.max(..._ids) + 1;
  const now = new Date();
  const newTask = {
    ...data,
    _id: next_id,
    createdAt: now,
    updatedAt: now,
    isComplete: false,
  };
  tasks.push(newTask);
  res.status(201).send(newTask);
});

app.get('/tasks', async (req, res) => {
  /** 쿼리 파라미터
   * - sort : 'oldest'인 경우 오래된 태스크 기준, 나머지 경우 새로운 태스크 기준
   * - count : 태스크 개수
   */
  const sort = req.query.sort;
  const count = Number(req.query.count) || 0;
  if (count <= 0) {
    return res.json([]);
  }
  const sortOption = sort === 'oldest' ? ['createdAt', 'asc'] : ['createdAt', 'desc'];
  const tasks = await Task.find().limit(count).sort([sortOption]);

  res.send(tasks);
});

app.get('/tasks/:_id', async (req, res) => {
  const task = await Task.findBy_id(req.params._id);
  if (task) {
    res.send(task);
  } else {
    res.status(404).send({ message: 'Cannot find given _id' });
  }
});

app.patch('/tasks/:_id', async (req, res) => {
  const task = await Task.findBy_id(req.params._id);
  if (task) {
    const { body } = req;
    Object.keys(body).forEach((key) => {
      task[key] = body[key];
    });
    await task.save();
    res.send(task);
  } else {
    res.status(404).send({ message: 'Cannot find given _id' });
  }
});

app.delete('/tasks/:_id', async (req, res) => {
  const task = await Task.findBy_idAndDelete(req.params._id);
  if (task) {
    res.sendStatus(200);
    // await task.deleteOne();
    // res.send({ message: 'Task deleted successfully' });
  } else {
    res.status(404).send({ message: 'Cannot find given _id' });
  }
});

app.listen(PORT, (err) => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`${err}`);
});
