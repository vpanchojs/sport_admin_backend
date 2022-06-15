import { EResponse } from "../../core/entities/e-reponse";
import { ESearchSportSpace } from "../../core/entities/e-search-sportspace";
import { ESportSpace } from "../../core/entities/e-sport-space";
import { Logger } from "../../utils/logger";
import { IncrementSportSpacesInCompanyUseCase } from "../usecase/company/increment-sport-spaces-in-company.usecase";
import { CreateSportSpaceUseCase } from "../usecase/sport-space/create-sport-space.usecase";
import { DisableSportSpaceUseCase } from "../usecase/sport-space/disable-sport-space.usecase";
import { EnableSportSpaceUseCase } from "../usecase/sport-space/enable-sport-space.usecase";
import { GetAllScheduleBySportSpaceUseCase } from "../usecase/sport-space/get-all-schedule-by-sport-space.usecase";
import { GetAllSportSpaceByCompanyUseCase } from "../usecase/sport-space/get-all-sport-space.usecase";
import { GetSportSpaceByIdUseCase } from "../usecase/sport-space/get-sport-space-by-id.usecase";

export class SportSpaceService {
    async createSportSpace(param: ESportSpace): Promise<ESportSpace> {
        try {
            const sportSpace = await new CreateSportSpaceUseCase().execute(param);
            try {
                await new IncrementSportSpacesInCompanyUseCase().execute(param.company?.companyId!);
            } finally {
                return sportSpace;
            }            
        } catch (error) {
            const e = new Logger().error("SportSpaceService - createSportSpace", error);
            return Promise.reject(e);
        }

    }

    async getAllSportSpacesByCompany(search: ESearchSportSpace): Promise<EResponse<ESportSpace[]>> {
        let response: EResponse<ESportSpace[]>;
        response = await new GetAllSportSpaceByCompanyUseCase().execute(search);

        if (response.code == 200) {
            for (const sportspace of response.data!) {
                const schedulesReponse = await new GetAllScheduleBySportSpaceUseCase().execute(sportspace);

                if (schedulesReponse.code == 200) {
                    sportspace.schedules = schedulesReponse.data!;
                }
            }
        }
        return response
    }

    async getSportSpaceById(search: ESearchSportSpace): Promise<EResponse<ESportSpace>> {
        let response: EResponse<ESportSpace>;
        response = await new GetSportSpaceByIdUseCase().execute(search);

        if (response.code == 200) {
            const schedulesReponse = await new GetAllScheduleBySportSpaceUseCase().execute(response.data!);

            if (schedulesReponse.code == 200) {
                response.data!.schedules = schedulesReponse.data!;
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
