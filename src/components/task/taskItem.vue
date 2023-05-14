<template>
  <q-card class="card">
    <q-card-section>
      {{ item.name }}
    </q-card-section>

    <q-card-actions>
      <q-btn
        label="del"
        color="negative"
        @click.stop="removeTask"
        :disable="loading"
        class="q-ml-auto"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Task } from '@/types';

type Props = {
  item: Task
  remove: (id: number) => Promise<void>
}
const props = defineProps<Props>();

const loading = ref(false);

const removeTask = async () => {
  loading.value = true;
  await props.remove(props.item.id);
  loading.value = false;
};
</script>

<style scoped lang="scss">
.card {
  max-width: 250px;
  cursor: pointer;
  &:hover {
    box-shadow: 0 1px 12px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.12);
  }
}
</style>
