<template>
  <main-layout>
    <RouterView />
  </main-layout>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainLayout from './layout/MainLayout.vue'
</script>
