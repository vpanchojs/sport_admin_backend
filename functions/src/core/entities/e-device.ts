import { EDeviceType } from "./catalog/e-device-type";

export interface EDevice {
  deviceId:string
  created:Date
  expired:Date
  name:string
  tokenNotification:string
  description:string
  type:EDeviceType
}