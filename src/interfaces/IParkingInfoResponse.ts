interface IParkingPosition {
  PositionLat: number
  PositionLon: number
}

interface IRoadSection {
  Start: string
  End: string
}

interface IParkingSegment {
  ParkingSegmentID: string
  ParkingSegmentName: {
    Zh_tw: string
  }
  RoadSection: IRoadSection
  ParkingSegmentPosition: IParkingPosition
  Description: string
  FareDescription: string
  HasChargingPoint: number
  City: string
  CityCode: string
}

export interface IParkingInfoResponse {
  UpdateTime: string
  UpdateInterval: number
  SrcUpdateTime: string
  SrcUpdateInterval: number
  AuthorityCode: string
  VersionID: number
  ParkingSegments: IParkingSegment[]
}
