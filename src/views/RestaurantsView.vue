<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import axios from 'axios'
import { Loader } from '@googlemaps/js-api-loader'
import { generateRandomIP } from '@/helpers/random'
import type { IRestaurantResponse } from '@/interfaces/IRestaurantResponse'
import type { IRestaurant } from '@/interfaces/IRestaurant'
import { defaultLocation, MAP_API_KEY } from '@/config'
import { formatDateTime } from '@/helpers/date'
import { formatTaiwanPhoneNumber } from '@/helpers/phone'
import { formatAddress } from '@/helpers/address'
import InputText from 'primevue/inputtext'

const loading = ref(true)
const restaurants = ref<IRestaurant[]>([])
const mapDiv = ref<HTMLElement | null>(null)

function formatRestaurant(response: IRestaurantResponse): IRestaurant {
  return {
    restaurantId: response.RestaurantID,
    restaurantName: response.RestaurantName,
    description: response.Description,
    address: formatAddress(response.Address),
    zipCode: response.ZipCode,
    phone: formatTaiwanPhoneNumber(response.Phone),
    openTime: response.OpenTime,
    picture: {
      pictureUrl: response.Picture.PictureUrl1,
      pictureDescription: response.Picture.PictureDescription1,
    },
    position: {
      longitude: response.Position.PositionLon,
      latitude: response.Position.PositionLat,
      geoHash: response.Position.GeoHash,
    },
    city: response.City,
    srcUpdateTime: new Date(response.SrcUpdateTime),
    updateTime: new Date(response.UpdateTime),
  }
}

async function initData() {
  try {
    const randomIP = generateRandomIP()

    const response = await axios.get<IRestaurantResponse[]>(
      'https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant/Taichung?%24format=JSON',
      {
        headers: {
          'X-Forwarded-For': randomIP,
        },
      },
    )

    console.log('response: ', response.data)
    restaurants.value = response.data?.map((x) => formatRestaurant(x)) ?? []
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

async function initMap() {
  const loader = new Loader({
    apiKey: MAP_API_KEY,
    version: 'weekly',
  })

  const google = await loader.load()
  const map = new google.maps.Map(mapDiv.value!, {
    center: defaultLocation,
    zoom: 13,
  })
  restaurants.value.forEach((restaurant) => {
    if (restaurant.position.latitude && restaurant.position.longitude) {
      const marker = new google.maps.Marker({
        position: {
          lat: restaurant.position.latitude,
          lng: restaurant.position.longitude,
        },
        map,
        title: restaurant.restaurantName,
      })

      const infoWindow = new google.maps.InfoWindow({
        content: `
        <div style="padding: 16px; max-width: 300px">
          <h3 style="margin: 0 0 12px; font-size: 16px; color: #1a73e8">
            ${restaurant.restaurantName}
          </h3>
          <p style="margin: 8px 0; color: #5f6368">
            <i class="pi pi-map-marker"></i> ${restaurant.address}
          </p>
          <p style="margin: 8px 0; color: #5f6368">
            <i class="pi pi-phone"></i> ${restaurant.phone}
          </p>
          <p style="margin: 8px 0; color: #5f6368">
            <i class="pi pi-clock"></i> ${restaurant.openTime}
          </p>
          <a 
            href="https://www.google.com/maps/dir/?api=1&destination=${restaurant.position.latitude},${restaurant.position.longitude}"
            target="_blank"
            style="display: inline-block; margin-top: 8px; color: #1a73e8; text-decoration: none"
          >
            在 Google Maps 導航 →
          </a>
        </div>
      `,
      })

      marker.addListener('click', () => {
        infoWindow.open(map, marker)
      })
    }
  })
}

const updateTime = computed(() => {
  return restaurants.value.length > 0 ? formatDateTime(restaurants.value[0].updateTime) : ''
})

onMounted(async () => {
  await initData()
  await initMap()
})
</script>

<template>
  <div>
    <div ref="mapDiv" style="height: 500px; margin-bottom: 20px"></div>
    <p>更新時間：{{ updateTime }}</p>
    <DataTable :value="restaurants" :loading="loading" paginator :rows="100">
      <Column header="圖片">
        <template #body="slotProps">
          <img
            :src="slotProps.data.picture.pictureUrl"
            :alt="slotProps.data.picture.pictureDescription"
            style="width: 100px; height: 100px; object-fit: cover"
          />
        </template>
      </Column>
      <Column field="restaurantName" header="餐廳名稱" sortable></Column>
      <Column field="address" header="地址" sortable></Column>
      <Column field="phone" header="電話"></Column>
      <Column field="openTime" header="營業時間"></Column>
      <Column header="導航">
        <template #body="slotProps">
          <a
            :href="`https://www.google.com/maps/dir/?api=1&destination=${slotProps.data.position.latitude},${slotProps.data.position.longitude}`"
            target="_blank"
            class="nav-link"
          >
            GO
          </a>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
