<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

interface Restaurant {
  id: number
  name: string
  address: string
  phone: string
  category: string
}

const restaurants = ref<Restaurant[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    // TODO: Replace with actual API call
    const response = await fetch('YOUR_API_ENDPOINT')
    restaurants.value = await response.json()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="card">
    <h1>台中餐廳列表</h1>

    <DataTable
      :value="restaurants"
      :loading="loading"
      paginator
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20]"
      stripedRows
    >
      <Column field="name" header="餐廳名稱" sortable></Column>
      <Column field="address" header="地址"></Column>
      <Column field="phone" header="電話"></Column>
      <Column field="category" header="類別" sortable></Column>
    </DataTable>
  </div>
</template>
