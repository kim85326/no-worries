import type { BusinessOpenStatus } from './enum'

export interface IRestaurant {
  restaurantId: string
  restaurantName: string
  description: string
  address: string
  zipCode: string
  phone: string
  openTime: string
  businessHours: IPeriod[]
  businessOpenStatus: BusinessOpenStatus
  picture: {
    pictureUrl: string
    pictureDescription: string
  }
  position: {
    longitude: number
    latitude: number
    geoHash: string
  }
  city: string
  srcUpdateTime: Date
  updateTime: Date
}

export interface IPeriod {
  start: string
  end: string
}
