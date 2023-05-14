import { api } from 'boot/axios';
import { Task } from 'src/types';
import { formatErr, formatRes } from 'src/api';

const API_URL = `${import.meta.env.VITE_API_URL}/tasks`;

export function fetchTasks(): Promise<Task[]> {
  return api
    .get(`${API_URL}/`)
    .then(formatRes)
    .catch((err) => formatErr(err, { prefix: 'Ошибка получения задач' }));
}

export function createTask(name: string): Promise<Task> {
  return api
    .post(`${API_URL}/create`, { name, type: 'new' })
    .then(formatRes)
    .catch((err) => formatErr(err, { prefix: 'Ошибка создания задачи' }));
}

export function deleteTask(id: number): Promise<void> {
  return api
    .delete(`${API_URL}/${id}`)
    .then(formatRes)
    .catch((err) => formatErr(err, { prefix: 'Ошибка удаления задачи' }));
}

export function updateTaks(task: Task): Promise<void> {
  return api
    .patch(`${API_URL}/${task.id}`, { type: task.type, name: task.name })
    .then(formatRes)
    .catch((err) => formatErr(err, { prefix: 'Ошибка обновления задачи' }));
}
