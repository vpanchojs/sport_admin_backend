import * as functions from "firebase-functions";
import { ScheduleService } from "../application/service/schedule.service";
import { EResponse } from "../core/entities/e-reponse";
import { ESchedule } from "../core/entities/e-schedule";

export const createSchedule = functions.https.onCall(async (data, context) => {
  functions.logger.info("controller - createSchedule: "+ data.toString());
  let schedule: ESchedule;
  schedule = {
    category: data.category,
    days: data.days,
    initHour: data.initHour,
    endHour: data.endHour,
    sportSpace: data.sportSpace,
    unitTimeUse:data.unitTimeUse,
    prices: data.prices
  }

  const response: EResponse<ESchedule> = await new ScheduleService().createSchedule(schedule);
  return response;

});

export const removeSchedule = functions.https.onCall(async (data, context) => {
  functions.logger.info("controller - removeSchedule: "+ data);
  
  const response: EResponse<ESchedule> = await new ScheduleService().removeSchedule(data);
  return response;

});
