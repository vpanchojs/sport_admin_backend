import { ECategory } from "./catalog/e-category";
import { EProductCondition } from "./catalog/e-product-condition";
import { EProductState } from "./catalog/e-product-state";
import { EAlbum } from "./e-album";

export interface EProduct {
  productId:string
  name:string
  feauters:string
  album:EAlbum
  state:EProductState
  condition:EProductCondition
  category:ECategory
  description:string
  updated:Date
  price:number
}
