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
            /*          
            if (param.name == null && param.admin?.account?.accountId == null) {
                return response = {
                    code: 400,
                    message: "Faltan algunos campos requeridos"
                }
            }
            */
            param.status = CScheduleStatus.enable         
        
            const scheduleCreated = await new ScheduleRepository().createSchedule(param)
            response = {
                data: scheduleCreated,
                code: 200,
            }

            for (const price of param.prices!) {
                console.log('price a crear', price);
                if(price != null){
                    price.schedule =  <ESchedule>{
                        scheduleId: scheduleCreated.scheduleId,
                        sportSpace: scheduleCreated.sportSpace
                    }                    
                    const priceCreated =  await new CreatePriceUseCase().execute(price); 
                    console.log('se creo priceCreated', priceCreated);                                      
                }

            }
        } catch (error) {
            functions.logger.log("CreateSportSpaceUseCase: " + error);
            response = {
                code: 400,
                message: "Problemas al crear el space sport"
            }
        }        
        return response;
    }

}