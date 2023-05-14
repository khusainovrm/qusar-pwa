<template>
  <div class="task-dashboard">
    <h5 class="q-mb-md q-px-md q-mt-none">Задачи 😀</h5>

    <transition name="fade" mode="out-in">
      <div v-if="loading" class="loading">
        <q-spinner size="3rem" />
      </div>
      <div v-else-if="!tasks?.length">
        <p class="q-px-md">Создайте задачу</p>
        <q-btn
          class="q-mx-md"
          label="+"
          color="primary"
          @click="showCreateDialog = true"
        />
      </div>
      <div v-else>
        <q-btn
          class="q-mb-md q-mx-md"
          label="+"
          color="primary"
          @click="showCreateDialog = true"
        />
        <div class="task-list" :class="{ mobile: $q.platform.is.mobile }">
          <div class="task-list__inner-container">
            <div
              v-for="column in columns"
              :key="column.name"
              class="task-list-column"
            >
              <h5>{{ column.name }}</h5>

              <draggable
                v-model="column.items"
                v-bind="dragOptions"
                item-key="id"
                class="task-list__items"
                :data-column-name="column.name"
                :force-fallback="true"
                :delay="$q.platform.is.mobile ? 200 : 0"
                @start="onDragStart"
                @end="onDragEnd"
              >
                <template #item="{ element }">
                  <TaskItem
                    :key="element.id"
                    :item="element"
                    :remove="removeTask"
                    :data-id="element.id"
                    class="list-draggable-item"
                  />
                </template>
              </draggable>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <q-dialog v-model="showCreateDialog">
      <q-card class="q-pa-md">
        <q-card-section>
          <h6>Что сделать?</h6>
          <q-input v-model="taskName" />
        </q-card-section>

        <q-card-actions>
          <q-btn
            label="Создать"
            color="primary"
            :disable="loadingCreation"
            @click="createTask"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import TaskItem from './taskItem.vue'
import type { Task } from '../../types'
import { useTaskStore } from '../../stores'

const $q = useQuasar()

const { fetch, create, remove, update } = useTaskStore()
const { tasks } = storeToRefs(useTaskStore())

const loading = ref(true)
const showCreateDialog = ref(false)
const taskName = ref('')
const loadingCreation = ref(false)
const columnNames = ['new', 'doing', 'done']
const columns = ref<{ name: string; items: Task[] }[]>([])
let columnsStateBeforeDrug: { name: string; items: Task[] }[] = []
const drag = ref(false)
const dragOptions = {
  animation: 200,
  group: 'tasks',
  disabled: drag.value,
  ghostClass: 'ghost',
}

const columnsByTasks = computed(() => {
  if (!tasks.value) {
    return {}
  }
  return (
    tasks.value.reduce<{ [key: string]: Task[] }>((acc, curr: Task) => {
      if (curr.type in acc) {
        acc[`${curr.type}`].push(curr)
      } else {
        acc[`${curr.type}`] = [curr]
      }
      return acc
    }, {}) || {}
  )
})

const refreshColumns = () => {
  columns.value = columnNames.map((name) => ({
    name,
    items: columnsByTasks.value[name] || [],
  }))
}

const createTask = async () => {
  if (!taskName.value) {
    return
  }
  try {
    loadingCreation.value = true
    await create(taskName.value)
    refreshColumns()
  } catch {
    /* empty */
  } finally {
    loadingCreation.value = false
    showCreateDialog.value = false
    taskName.value = ''
  }
}
const removeTask = async (id: number) => {
  try {
    await remove(id)
    refreshColumns()
  } catch {
    /* empty */
  }
}
const changeTaskOrder = async (task: Task) => {
  try {
    await update(task)
    columnsStateBeforeDrug = []
  } catch (e) {
    columns.value = columnsStateBeforeDrug
  }
}

const onDragStart = () => {
  columnsStateBeforeDrug = JSON.parse(JSON.stringify(columns.value)) as {
    name: string
    items: Task[]
  }[]
  drag.value = true
  navigator.vibrate(100)
}

const onDragEnd = async (e: {
  item: { dataset: { id: string | number } }
  to: { dataset: { columnName: never } }
}) => {
  const foundTask = tasks.value?.find((task) => task.id === +e.item.dataset.id)

  if (foundTask) {
    await changeTaskOrder({ ...foundTask, type: e.to.dataset.columnName })
  }
  drag.value = false
}

onMounted(async () => {
  loading.value = true
  await fetch()
  refreshColumns()
  loading.value = false
})
</script>

<style scoped lang="scss">
.loading {
  display: grid;
  place-items: center;
  min-height: 250px;
}
.task-dashboard {
}
.task-list {
  overflow: hidden;
  height: calc(100vh - 192px);
  &.mobile {
    height: calc(100vh - 236px);
  }
  &-column {
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 250px;

    padding: 16px;
  }

  &__inner-container {
    display: flex;
    flex-direction: row;
    gap: 16px;
    height: 100%;
    overflow: auto;
    padding: 2px;
  }
  &__items {
    border: 1px solid;
    display: flex;
    flex: 1;
    flex-flow: column;
    gap: 16px;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
