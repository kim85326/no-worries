<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import axios from 'axios'
import type { IParkingInfoResponse } from '@/interfaces/IParkingInfoResponse'
import type { IDynamicParkingResponse } from '@/interfaces/IDynamicParkingResponse'
import type { IParking } from '@/interfaces/IParking'
import { Loader } from '@googlemaps/js-api-loader'
import { format } from 'date-fns'

const loading = ref(true)
const parkingSpaces = ref<IParking[]>([])
const mapDiv = ref<HTMLElement | null>(null)

async function initData() {
  try {
    const [availabilityData, parkingInfoData] = await Promise.all([
      axios.get<IDynamicParkingResponse>(
        // 'https://tdx.transportdata.tw/api/basic/v1/Parking/OnStreet/ParkingSegmentAvailability/City/Taichung?%24format=JSON',
        '/tc-dynamic-parking.json',
      ),
      axios.get<IParkingInfoResponse>('/tc-parking.json'),
    ])
    console.log('availabilityData: ', availabilityData.data)
    console.log('parkingInfoData: ', parkingInfoData.data)
    const mergedData = availabilityData.data.CurbParkingSegmentAvailabilities.map((segment) => {
      const parkingInfo = parkingInfoData.data.ParkingSegments.find(
        (info) => info.ParkingSegmentID === segment.ParkingSegmentID,
      )
      if (!parkingInfo) return null
      return {
        parkingSegmentID: segment.ParkingSegmentID,
        parkingSegmentName: {
          zh_tw: segment.ParkingSegmentName.Zh_tw,
        },
        totalSpaces: segment.TotalSpaces,
        availableSpaces: segment.AvailableSpaces,
        availabilities: segment.Availabilities.map((a) => ({
          spaceType: a.SpaceType,
          numberOfSpaces: a.NumberOfSpaces,
          availableSpaces: a.AvailableSpaces,
        })),
        serviceStatus: segment.ServiceStatus,
        fullStatus: segment.FullStatus,
        chargeStatus: segment.ChargeStatus,
        dataCollectTime: segment.DataCollectTime,
        updateTime: format(new Date(segment.DataCollectTime), 'yyyy-MM-dd HH:mm:ss'),
        latitude: parkingInfo.ParkingSegmentPosition?.PositionLat,
        longitude: parkingInfo.ParkingSegmentPosition?.PositionLon,
        fareDescription: parkingInfo.FareDescription,
      }
    })
      .filter((x) => x !== null)
      .filter((x) => x.availabilities.some((a) => a.numberOfSpaces > 0))

    console.log('mergedData: ', mergedData)
    parkingSpaces.value = mergedData
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

async function initMap() {
  const loader = new Loader({
    apiKey: 'AIzaSyDLVjzl80Jb6ZY-Otw5PEEVfoaHu4gI0-Y',
    version: 'weekly',
  })

  const google = await loader.load()
  const map = new google.maps.Map(mapDiv.value!, {
    center: { lat: 24.1571344, lng: 120.6539335 }, // 台中市政府
    zoom: 13,
  })

  parkingSpaces.value.forEach((space) => {
    if (space.latitude && space.longitude) {
      const marker = new google.maps.Marker({
        position: {
          lat: space.latitude,
          lng: space.longitude,
        },
        map,
        title: space.parkingSegmentName.zh_tw,
      })

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px">
            <h3 style="margin: 0 0 8px">${space.parkingSegmentName.zh_tw}</h3>
            <p style="margin: 4px 0">可用車位: ${space.availableSpaces}/${space.totalSpaces}</p>
            <p style="margin: 4px 0">費率: ${space.fareDescription}</p>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${space.latitude},${space.longitude}" 
              target="_blank" 
              style="display: inline-block; margin-top: 8px; color: #1a73e8; text-decoration: none">
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

onMounted(async () => {
  await initData()
  await initMap()
})
</script>

<template>
  <div class="parking-view">
    <div ref="mapDiv" style="height: 500px; margin-bottom: 20px"></div>

    <DataTable :value="parkingSpaces" :loading="loading" paginator :rows="100">
      <Column field="parkingSegmentID" header="ID"></Column>
      <Column field="parkingSegmentName.Zh_tw" header="名稱"></Column>
      <Column field="totalSpaces" header="總車位"></Column>
      <Column field="availableSpaces" header="可用車位"></Column>
      <Column field="fareDescription" header="費率說明"></Column>
      <Column field="updateTime" header="更新時間"></Column>
    </DataTable>
  </div>
</template>

<style scoped>
.parking-view {
  padding: 20px;
}
</style>
