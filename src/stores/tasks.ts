import { defineStore } from 'pinia';
import { getErrorMessage } from '../api';
import type { Task } from '@/types';
import {
  createTask, deleteTask, fetchTasks, updateTaks,
} from '../api/task';
import { rErrorNotify } from '../utils/notify';

type AuthState = {
  tasks: Task[] | null
}

export default defineStore('task', {
  state: (): AuthState => ({
    tasks: null,
  }),
  actions: {
    async fetch() {
      try {
        this.tasks = await fetchTasks();
      } catch (error) {
        rErrorNotify(getErrorMessage(error));
      }
    },
    async create(name: string) {
      try {
        const task = await createTask(name);
        this.tasks?.push(task);
      } catch (error) {
        rErrorNotify(getErrorMessage(error));
        await Promise.reject();
      }
    },
    async remove(id: number) {
      try {
        await deleteTask(id);
        this.tasks = this.tasks?.filter((i) => i.id !== id) || [];
      } catch (error) {
        rErrorNotify(getErrorMessage(error));
        await Promise.reject();
      }
    },
    async update(task: Task) {
      try {
        await updateTaks(task);
        this.tasks = this.tasks?.map((t) => {
          if (t.id === task.id) {
            t.type = task.type;
          }
          return t;
        }) || [];
      } catch (error) {
        rErrorNotify(getErrorMessage(error));
        await Promise.reject();
      }
    },
  },
});
