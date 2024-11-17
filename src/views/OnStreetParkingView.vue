<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import axios from 'axios'
import type { IParkingInfoResponse } from '@/interfaces/IParkingInfoResponse'
import type { IDynamicParkingResponse } from '@/interfaces/IDynamicParkingResponse'
import type { IParking } from '@/interfaces/IParking'
import { Loader } from '@googlemaps/js-api-loader'
import { generateRandomIP } from '@/helpers/random'
import { defaultLocation, MAP_API_KEY } from '@/config'
import { formatDateTime } from '@/helpers/date'

const loading = ref(true)
const parkings = ref<IParking[]>([])
const mapDiv = ref<HTMLElement | null>(null)

async function initData() {
  try {
    const randomIP = generateRandomIP()

    const baseURL = import.meta.env.VITE_API_BASE_URL
    const [dynamicParkingResponse, parkingInfoResponse] = await Promise.all([
      axios.get<IDynamicParkingResponse>(
        'https://tdx.transportdata.tw/api/basic/v1/Parking/OnStreet/ParkingSegmentAvailability/City/Taichung?%24format=JSON',
        {
          headers: {
            'X-Forwarded-For': randomIP,
          },
        },
      ),
      axios.get<IParkingInfoResponse>(`${baseURL}/tc-parking.json`),
    ])

    console.log('dynamicParkingResponse: ', dynamicParkingResponse.data)
    console.log('parkingInfoResponse: ', parkingInfoResponse.data)

    const mergedData = dynamicParkingResponse.data.CurbParkingSegmentAvailabilities.map(
      (segment) => {
        const parkingInfo = parkingInfoResponse.data.ParkingSegments.find(
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
          updateTime: new Date(segment.DataCollectTime),
          latitude: parkingInfo.ParkingSegmentPosition?.PositionLat,
          longitude: parkingInfo.ParkingSegmentPosition?.PositionLon,
          fareDescription: parkingInfo.FareDescription,
        }
      },
    )
      .filter((x) => x !== null)
      .filter((x) => x.availabilities.some((a) => a.numberOfSpaces > 0))

    console.log('mergedData: ', mergedData)
    parkings.value = mergedData
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

  const { Map, Circle, InfoWindow } = await loader.importLibrary("maps");
  const map = new Map(mapDiv.value!, {
    center: defaultLocation,
    zoom: 13,
  })

  parkings.value.forEach((space) => {
    if (space.latitude && space.longitude) {
      const { latitude, longitude } = space;
      const useRate = space.availableSpaces / space.totalSpaces

      const getColor = (rate: number) => {
        if (rate > 0.5) return '#4CAF50' // 綠色: 很多空位
        if (rate > 0.3) return '#FFC107' // 黃色: 一般
        return '#F44336' // 紅色: 很少空位
      }

      const circle = new Circle({
        strokeColor: getColor(useRate),
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: getColor(useRate),
        fillOpacity: 0.35,
        map,
        center: {
          lat: latitude,
          lng: longitude,
        },
        radius: 50 + space.availableSpaces * 5,
      })

      circle.addListener('click', async () => {
        try {
          const nearbyPlaces = await fetchNearbyPlaces(latitude, longitude, loader, map)
          console.log('nearbyPlaces:', nearbyPlaces);
          const placesList = nearbyPlaces.map((place) => `<li>${place.name}</li>`).join('')

          const infoWindow = new InfoWindow({
            content: `
              <div style="padding: 8px">
                <h3 style="margin: 0 0 8px">${space.parkingSegmentName.zh_tw}</h3>
                <p style="margin: 4px 0">可用車位: ${space.availableSpaces}/${space.totalSpaces}</p>
                <p style="margin: 4px 0">費率: ${space.fareDescription}</p>
                <h4>附近餐廳:</h4>
                <ul>${placesList}</ul>
              </div>
            `,
              position: {
                lat: space.latitude,
                lng: space.longitude,
              },
            })
          infoWindow.open(map)
        } catch (error) {
          console.error('Error fetching nearby places:', error)
        }
      })
    }
  })
}

async function fetchNearbyPlaces(latitude: number, longitude: number, loader: any, map: any): Promise<IPlaceResult[]> {
  const { PlacesService, PlacesServiceStatus } = await loader.importLibrary("places");
  const service = new PlacesService(map)

  return new Promise((resolve, reject) => {
    service.nearbySearch(
      {
        location: { lat: latitude, lng: longitude },
        radius: 1000,
        type: 'restaurant',
        openNow: true,
      },
      (results: IPlaceResult[], status: typeof PlacesServiceStatus) => {
        if (status === PlacesServiceStatus.OK) {
          resolve(results)
        } else {
          reject(status)
        }
      },
    )
  })
}

const updateTime = computed(() => {
  return parkings.value.length > 0 ? formatDateTime(parkings.value[0].updateTime) : ''
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
    <DataTable
      :value="parkings"
      :loading="loading"
      paginator
      :rows="100"
      sortField="availableSpaces"
      :sortOrder="-1"
    >
      <Column field="parkingSegmentName.zh_tw" sortable header="名稱"></Column>
      <Column field="totalSpaces" sortable header="總車位"></Column>
      <Column field="availableSpaces" :sortable="true" header="可用車位"></Column>
      <Column field="fareDescription" header="費率說明"></Column>
      <Column header="導航">
        <template #body="slotProps">
          <a
            :href="`https://www.google.com/maps/dir/?api=1&destination=${slotProps.data.latitude},${slotProps.data.longitude}`"
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
