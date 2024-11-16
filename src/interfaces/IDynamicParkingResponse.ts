interface ISpaceAvailability {
  SpaceType: number
  NumberOfSpaces: number
  AvailableSpaces: number
}

interface IParkingSegmentDynamic {
  ParkingSegmentID: string
  ParkingSegmentName: {
    Zh_tw: string
  }
  TotalSpaces: number
  AvailableSpaces: number
  Availabilities: ISpaceAvailability[]
  ServiceStatus: number
  FullStatus: number
  ChargeStatus: number
  DataCollectTime: string
}

export interface IDynamicParkingResponse {
  CurbParkingSegmentAvailabilities: IParkingSegmentDynamic[]
}
