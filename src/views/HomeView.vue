<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="grid">
    <div class="col-12 text-center mb-5">
      <h1 class="text-4xl mb-2">歡迎使用台中市資訊查詢系統</h1>
      <p class="text-xl text-500">快速查詢餐廳與停車資訊</p>
    </div>

    <div class="col-12 md:col-6">
      <Card class="h-full">
        <template #header>
          <i class="pi pi-map-marker text-4xl text-primary"></i>
        </template>
        <template #title>餐廳查詢</template>
        <template #content>
          <p>查詢台中市各地區餐廳資訊，包含地址、評價等詳細資料。</p>
        </template>
        <template #footer>
          <Button label="立即查詢" icon="pi pi-search" @click="navigateTo('/restaurants')" />
        </template>
      </Card>
    </div>

    <div class="col-12 md:col-6">
      <Card class="h-full">
        <template #header>
          <i class="pi pi-car text-4xl text-primary"></i>
        </template>
        <template #title>停車資訊</template>
        <template #content>
          <p>查詢台中市停車場即時資訊，掌握車位availability與收費標準。</p>
        </template>
        <template #footer>
          <Button
            label="立即查詢"
            icon="pi pi-search"
            severity="secondary"
            @click="navigateTo('/parking')"
          />
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
