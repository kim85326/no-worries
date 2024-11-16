export interface IParking {
  parkingSegmentID: string
  parkingSegmentName: {
    zh_tw: string
  }
  totalSpaces: number
  availableSpaces: number
  availabilities: {
    spaceType: number
    numberOfSpaces: number
    availableSpaces: number
  }[]
  serviceStatus: number
  fullStatus: number
  chargeStatus: number
  dataCollectTime: string
  latitude?: number
  longitude?: number
  fareDescription?: string
}
