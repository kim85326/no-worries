<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import axios from 'axios'
import type { IParkingInfoResponse } from '@/interfaces/IParkingInfoResponse'
import type { IDynamicParkingResponse } from '@/interfaces/IDynamicParkingResponse'
import type { IParking } from '@/interfaces/IParking'

const parkingSpaces = ref<IParking[]>([])
const loading = ref(true)

onMounted(async () => {
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
        latitude: parkingInfo.ParkingSegmentPosition?.PositionLat,
        longitude: parkingInfo.ParkingSegmentPosition?.PositionLon,
        fareDescription: parkingInfo.FareDescription,
      }
    }).filter((x) => x !== null)

    console.log('mergedData: ', mergedData)
    parkingSpaces.value = mergedData
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <DataTable :value="parkingSpaces" :loading="loading" paginator :rows="100">
    <Column field="parkingSegmentID" header="ID"></Column>
    <Column field="parkingSegmentName.Zh_tw" header="名稱"></Column>
    <Column field="totalSpaces" header="總車位"></Column>
    <Column field="availableSpaces" header="可用車位"></Column>
    <Column field="fareDescription" header="費率說明"></Column>
    <Column field="dataCollectTime" header="更新時間"></Column>
  </DataTable>
</template>
