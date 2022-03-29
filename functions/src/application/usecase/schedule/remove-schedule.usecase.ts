import { UseCase } from "../../../core/base/usecase";
import { EResponse } from "../../../core/entities/e-reponse";
import * as functions from "firebase-functions";
import { ESchedule } from "../../../core/entities/e-schedule";
import { CScheduleStatus } from "../../../core/entities/enum/c-schedule-status";
import { ScheduleRepository } from "../../../infraestructure/schedule.repository";

export class RemoveScheduleUseCase implements UseCase<ESchedule, EResponse<ESchedule>>{

    async execute(param: ESchedule): Promise<EResponse<ESchedule>> {
        let response: EResponse<ESchedule>;
        try {

            param.status = CScheduleStatus.remove         
        
            const schduleUpdated = await new ScheduleRepository().removeSchedule(param)
            response = {
                data: schduleUpdated,
                code: 200,
            }
        } catch (error) {
            functions.logger.error("RemoveScheduleUseCase: " + error);
            response = {
                code: 400,
                message: "Problemas al remover el horario"
            }
        }        
        return response;
    }

}