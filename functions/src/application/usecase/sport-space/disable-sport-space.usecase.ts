import { UseCase } from "../../../core/base/usecase";
import { EResponse } from "../../../core/entities/e-reponse";
import { ESportSpace } from "../../../core/entities/e-sport-space";
import * as functions from "firebase-functions";
import { CSportSpaceStatus } from "../../../core/entities/enum/c-sport-space-status";
import { SportSpaceRepository } from "../../../infraestructure/user/sport-space.repository";

export class DisableSportSpaceUseCase implements UseCase<ESportSpace, EResponse<ESportSpace>>{

    async execute(param: ESportSpace): Promise<EResponse<ESportSpace>> {
        let response: EResponse<ESportSpace>;
        try {

            param.status = CSportSpaceStatus.disable         
        
            const sportSpaceUpdated = await new SportSpaceRepository().disableSportSpace(param)
            response = {
                data: sportSpaceUpdated,
                code: 200,
            }
        } catch (error) {
            functions.logger.error("DisableSportSpaceUseCase: " + error);
            response = {
                code: 400,
                message: "Problemas al desactivar el centro deportivo"
            }
        }        
        return response;
    }

}