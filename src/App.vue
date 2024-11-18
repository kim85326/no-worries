<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import Menubar from 'primevue/menubar'

const router = useRouter()

const items = ref([
  {
    label: '首頁',
    icon: 'pi pi-fw pi-home',
    command: () => router.push('/'),
  },
  {
    label: '餐廳查詢',
    icon: 'pi pi-fw pi-map-marker',
    command: () => router.push('/restaurants'),
  },
  {
    label: '路邊停車資訊',
    icon: 'pi pi-fw pi-car',
    command: () => router.push('/on-street-parking'),
  },
])
</script>

<template>
  <div>
    <Menubar :model="items" class="mb-4">
      <template #start>
        <img alt="logo" src="@/assets/logo.svg" height="40" class="mr-2" />
      </template>
    </Menubar>

    <div class="container">
      <RouterView />
    </div>
  </div>
</template>

<style>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
