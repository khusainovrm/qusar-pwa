// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { api } from 'boot/axios'
import { Task } from 'src/types'
import { formatErr, formatRes } from 'src/api'

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
const API_URL = `${import.meta.env.VITE_API_URL}/tasks`

export function fetchTasks(): Promise<Task[]> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
  return api
    .get(`${API_URL}/`)
    .then(formatRes)
    .catch(
      (err: {
        response: { data: { error: any }; status: any }
        message: string
        status: any
      }) => formatErr(err, { prefix: 'Ошибка получения задач' }),
    )
}

export function createTask(name: string): Promise<Task> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
  return api
    .post(`${API_URL}/create`, { name, type: 'new' })
    .then(formatRes)
    .catch(
      (err: {
        response: { data: { error: any }; status: any }
        message: string
        status: any
      }) => formatErr(err, { prefix: 'Ошибка создания задачи' }),
    )
}

export function deleteTask(id: number): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
  return api
    .delete(`${API_URL}/${id}`)
    .then(formatRes)
    .catch(
      (err: {
        response: { data: { error: any }; status: any }
        message: string
        status: any
      }) => formatErr(err, { prefix: 'Ошибка удаления задачи' }),
    )
}

export function updateTaks(task: Task): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
  return api
    .patch(`${API_URL}/${task.id}`, { type: task.type, name: task.name })
    .then(formatRes)
    .catch(
      (err: {
        response: { data: { error: any }; status: any }
        message: string
        status: any
      }) => formatErr(err, { prefix: 'Ошибка обновления задачи' }),
    )
}
