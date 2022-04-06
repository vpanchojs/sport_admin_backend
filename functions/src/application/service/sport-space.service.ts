import { EResponse } from "../../core/entities/e-reponse";
import { ESearchSportSpace } from "../../core/entities/e-search-sportspace";
import { ESportSpace } from "../../core/entities/e-sport-space";
import { CreateSportSpaceUseCase } from "../usecase/sport-space/create-sport-space.usecase";
import { DisableSportSpaceUseCase } from "../usecase/sport-space/disable-sport-space.usecase";
import { EnableSportSpaceUseCase } from "../usecase/sport-space/enable-sport-space.usecase";
import { GetAllScheduleBySportSpaceUseCase } from "../usecase/sport-space/get-all-schedule-by-sport-space.usecase";
import { GetAllSportSpaceByCompanyUseCase } from "../usecase/sport-space/get-all-sport-space.usecase";

export class SportSpaceService {
    async createSportSpace(sportSpace: ESportSpace): Promise<EResponse<ESportSpace>> {
        let response: EResponse<ESportSpace>;     
        response = await new CreateSportSpaceUseCase().execute(sportSpace);

        if (response.data == null) {
            response = {
                code: 400,
                message: response.message
            }
        }
        return response;

    }

    async getAllSportSpacesByCompany(search: ESearchSportSpace): Promise<EResponse<ESportSpace[]>> {
        let response: EResponse<ESportSpace[]>;
        response = await new GetAllSportSpaceByCompanyUseCase().execute(search);    
        
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

    async enableSportSpace(sportSpace: ESportSpace): Promise<EResponse<ESportSpace>> {
        let response: EResponse<ESportSpace>;     
        response = await new EnableSportSpaceUseCase().execute(sportSpace);

        if (response.data == null) {
            response = {
                code: 400,
                message: response.message
            }
        }
        return response;

    }

    async disableSportSpace(sportSpace: ESportSpace): Promise<EResponse<ESportSpace>> {
        let response: EResponse<ESportSpace>;     
        response = await new DisableSportSpaceUseCase().execute(sportSpace);

        if (response.data == null) {
            response = {
                code: 400,
                message: response.message
            }
        }
        return response;

    }
}
