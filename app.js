import express from 'express';
import { tasks } from './mock.js';

const PORT = 3000;
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Express server!');
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
  const compareFn = sort === 'oldest' ? (a, b) => a.createdAt - b.createdAt : (a, b) => b.createdAt - a.createdAt;
  let newTasks = tasks.sort(compareFn);
  if (count) {
    newTasks = newTasks.slice(0, Number(count));
  }
  res.send(newTasks);
});

app.listen(PORT, (err) => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`${err}`);
});
