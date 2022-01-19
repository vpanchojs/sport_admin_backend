import { ESchedule } from "./e-schedule";
import { CPriceStatus } from "./enum/c-price-status";

export interface EPrice{
    priceId?:String;
    value?:number;
    currency?:CCurrency;
    status?:CPriceStatus;
    created?:Date;
    updated?:Date;
    schedule?:ESchedule
  }