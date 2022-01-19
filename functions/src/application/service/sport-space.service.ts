import { ECompany } from "../../core/entities/e-company";
import { EResponse } from "../../core/entities/e-reponse";
import { ESchedule } from "../../core/entities/e-schedule";
import { ESportSpace } from "../../core/entities/e-sport-space";
import { CreateScheduleUseCase } from "../usecase/sport-space/create-schedule.usecase";
import { CreateSportSpaceUseCase } from "../usecase/sport-space/create-sport-space.usecase";
import { GetAllScheduleBySportSpaceUseCase } from "../usecase/sport-space/get-all-schedule-by-sport-space.usecase";
import { GetAllSportSpaceByCompanyUseCase } from "../usecase/sport-space/get-all-sport-space.usecase";

export class SportSpaceService {
    async createSportSpace(sportSpace: ESportSpace): Promise<EResponse<ESportSpace>> {
        let response: EResponse<ESportSpace>;
        // Crear la compañia,         
        response = await new CreateSportSpaceUseCase().execute(sportSpace);

        if (response.data == null) {
            response = {
                code: 400,
                message: response.message
            }
        }
        return response;

    }

    async createSchedule(schedule: ESchedule): Promise<EResponse<ESchedule>> {
        let response: EResponse<ESchedule>;
        response = await new CreateScheduleUseCase().execute(schedule);

        if (response.data == null) {
            response = {
                code: 400,
                message: response.message
            }
        }
        return response;

    }

    async getAllSportSpacesByCompany(company: ECompany): Promise<EResponse<ESportSpace[]>> {
        let response: EResponse<ESportSpace[]>;
        response = await new GetAllSportSpaceByCompanyUseCase().execute(company);    
        
        if(response.code == 200){
            for (const sportspace of response.data!) {
                const schedulesReponse =  await new GetAllScheduleBySportSpaceUseCase().execute(sportspace);

                if(schedulesReponse.code == 200){
                    sportspace.schedules = schedulesReponse.data!;
                }
            }
        }        
        return response
    }
}
