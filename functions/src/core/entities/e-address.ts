import { EAddressType } from "./catalog/e-address-type";
import { ECity } from "./catalog/e-city";
import { ECountry } from "./catalog/e-country";

export interface EAddress {
  addressId: string
  description: string
  lat: number
  long: number
  country: ECountry
  city: ECity
  emails: Array<string>
  phones: Array<string>
  type: EAddressType
}