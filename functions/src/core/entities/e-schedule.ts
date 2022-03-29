import { EPrice } from "./e-price";
import { ESportSpace } from "./e-sport-space";
import { CScheduleCategory } from "./enum/c-schedule-category";
import { CScheduleStatus } from "./enum/c-schedule-status";

export interface ESchedule {
    scheduleId?:String;
    initHour?:number;
    endHour?:number;
    unitTimeUse?:number;
    category?:CScheduleCategory
    status?:CScheduleStatus;
    days?:any[];
    created?:Date;
    updated?:Date;
    prices?:EPrice[];
    sportSpace?:ESportSpace
  }


export function getOnlyHour(number : number) : number {
  return number % 60 ;
}


export function getOnlyMinute(number : number) : number{
  const hours: number = getOnlyHour(number);
  return number  - (hours * 60);
}