import { EResponse } from "../../core/entities/e-reponse";
import { ESchedule } from "../../core/entities/e-schedule";
import { RemoveScheduleUseCase } from "../usecase/schedule/remove-schedule.usecase";
import { CreateScheduleUseCase } from "../usecase/sport-space/create-schedule.usecase";
import { GetAllScheduleBySportSpaceUseCase } from "../usecase/sport-space/get-all-schedule-by-sport-space.usecase";
import * as functions from "firebase-functions";
import { ESportSpace } from "../../core/entities/e-sport-space";

export class ScheduleService {
    async createSchedule(schedule: ESchedule): Promise<EResponse<ESchedule>> {
        let response: EResponse<ESchedule>;
        //Obtener la lista de horarios creados.
        //Verificar si se puede generar horarios correctamente

        const totalMinutes = schedule.endHour! - schedule.initHour!;
        if (totalMinutes % schedule.unitTimeUse! != 0) {
            response = {
                code: 412,
                message: 'La unidad de tiempo no es divisible para el rango horario'
            }
            return response;  
        }

        const schedulesResponse =  await new GetAllScheduleBySportSpaceUseCase().execute(schedule.sportSpace!);
        let collisionSchedules = false;
        if(schedulesResponse.code == 200){
            for (let day of schedule.days!){
                for(let scheduleOld of schedulesResponse.data!){
                    for(let dayOld of scheduleOld.days!){
                        if(dayOld == day){

                            if(schedule.initHour! > scheduleOld.initHour! && schedule.initHour! < scheduleOld.endHour!){
                                functions.logger.error("ScheduleService - createSchedule: initHour " +  schedule.initHour);
                                functions.logger.error("ScheduleService - createSchedule: oldInitHour " +  scheduleOld.initHour);                                
                                functions.logger.error("ScheduleService - createSchedule: oldEndHour " +  scheduleOld.endHour!);
                                collisionSchedules = true;
                                break;
                            }                            


                            if(schedule.endHour! > scheduleOld.initHour! && schedule.endHour! < scheduleOld.endHour!){
                                functions.logger.error("ScheduleService - createSchedule: endHour " +  schedule.endHour);
                                functions.logger.error("ScheduleService - createSchedule: oldInitHour " +  scheduleOld.initHour!);
                                functions.logger.error("ScheduleService - createSchedule: oldEndHour " +  scheduleOld.endHour!);
                                collisionSchedules = true;
                                break;
                            }

                        }
                    }
                }
            }
        }
        
        if(collisionSchedules){            
            response = {
                code: 412,
                message: 'Se encontraron colisiones con otros horarios, modifique y vuelva a intentarlo'
            }
            return response;
        }
        
        response = await new CreateScheduleUseCase().execute(schedule);

        if (response.data == null) {
            response = {
                code: 400,
                message: response.message
            }
        }
        return response;

    }

    async removeSchedule(schedule: ESchedule): Promise<EResponse<ESchedule>> {
        let response: EResponse<ESchedule>;     
        response = await new RemoveScheduleUseCase().execute(schedule);

        if (response.data == null) {
            response = {
                code: 400,
                message: response.message
            }
        }
        return response;

    }

    async getAllSchedulesBySportSpace(sportSpace: ESportSpace): Promise<EResponse<ESchedule[]>> {
        let response: EResponse<ESchedule[]>;   
        
        response =  await new GetAllScheduleBySportSpaceUseCase().execute(sportSpace);
        
        return response
    }


}
