import { UseCase } from "../../../core/base/usecase";
import { EResponse } from "../../../core/entities/e-reponse";
import * as functions from "firebase-functions";
import { ESchedule } from "../../../core/entities/e-schedule";
import { CScheduleStatus } from "../../../core/entities/enum/c-schedule-status";
import { ScheduleRepository } from "../../../infraestructure/schedule.repository";
import { CreatePriceUseCase } from "../price/create-price.usecase";

export class CreateScheduleUseCase implements UseCase<ESchedule, EResponse<ESchedule>>{

    async execute(param: ESchedule): Promise<EResponse<ESchedule>> {
        let response: EResponse<ESchedule>;
        try {  

            param.status = CScheduleStatus.enable         
        
            const scheduleCreated = await new ScheduleRepository().createSchedule(param)
            response = {
                data: scheduleCreated,
                code: 200,
            }

            for (const price of param.prices!) {
                if(price != null){
                    price.schedule =  <ESchedule>{
                        scheduleId: scheduleCreated.scheduleId,
                        sportSpace: scheduleCreated.sportSpace
                    }                    
                    await new CreatePriceUseCase().execute(price);                         
                }

            }
        } catch (error) {
            functions.logger.log("CreateScheduleUseCase: " + error);
            response = {
                code: 400,
                message: "Problemas al crear el horario"
            }
        }        
        return response;
    }

}