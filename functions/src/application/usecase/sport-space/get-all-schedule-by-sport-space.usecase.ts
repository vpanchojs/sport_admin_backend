import { UseCase } from "../../../core/base/usecase";
import { EResponse } from "../../../core/entities/e-reponse";
import { ESchedule } from "../../../core/entities/e-schedule";
import { ESportSpace } from "../../../core/entities/e-sport-space";
import * as functions from "firebase-functions";
import { ScheduleRepository } from "../../../infraestructure/schedule.repository";
import { PriceRepository } from "../../../infraestructure/price.repository";
import { ECompany } from "../../../core/entities/e-company";

export class GetAllScheduleBySportSpaceUseCase implements UseCase<ESportSpace, EResponse<ESchedule[]>>{

    async execute(param: ESportSpace): Promise<EResponse<ESchedule[]>> {
        let response: EResponse<ESchedule[]>;
        try {          
            const schedules = await new ScheduleRepository().getAllSchedulesBySportSpace(param)
            
            if(schedules.length > 0){
                for (const schedule of schedules) {
                    let scheduleParam = <ESchedule>{
                        scheduleId: schedule.scheduleId,
                        sportSpace: <ESportSpace>{
                            sportSpaceId : param.sportSpaceId,
                            company: <ECompany>{
                                companyId:param.company?.companyId
                            }
                        }
                    }                  
                    const prices =  await new PriceRepository().getAllPriceBySchedule(scheduleParam);    
                    schedule.prices = prices;
                }
            } 
                       
            response = {
                data: schedules,
                code: 200,
            }
        } catch (error) {
            functions.logger.log("GetAllScheduleBySportSpaceUseCase: " + error);
            response = {
                code: 400,
                message: "Problemas al obtener los space sport"
            }
        }        
        return response;
    }

}