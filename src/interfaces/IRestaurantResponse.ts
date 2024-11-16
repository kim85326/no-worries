export interface IRestaurantResponse {
  RestaurantID: string
  RestaurantName: string
  Description: string
  Address: string
  ZipCode: string
  Phone: string
  OpenTime: string
  Picture: {
    PictureUrl1: string
    PictureDescription1: string
  }
  Position: {
    PositionLon: number
    PositionLat: number
    GeoHash: string
  }
  City: string
  SrcUpdateTime: string
  UpdateTime: string
}
