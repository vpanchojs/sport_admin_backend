import { UseCase } from "../../../core/base/usecase";
import { EResponse } from "../../../core/entities/e-reponse";
import { ESportSpace } from "../../../core/entities/e-sport-space";
import * as functions from "firebase-functions";
import { CSportSpaceStatus } from "../../../core/entities/enum/c-sport-space-status";
import { SportSpaceRepository } from "../../../infraestructure/user/sport-space.repository";

export class CreateSportSpaceUseCase implements UseCase<ESportSpace, EResponse<ESportSpace>>{

    async execute(param: ESportSpace): Promise<EResponse<ESportSpace>> {
        let response: EResponse<ESportSpace>;
        try {  
            /*          
            if (param.name == null && param.admin?.account?.accountId == null) {
                return response = {
                    code: 400,
                    message: "Faltan algunos campos requeridos"
                }
            }
            */
            param.status = CSportSpaceStatus.enable         
        
            const sportSpaceCreated = await new SportSpaceRepository().createSportSpace(param)
            response = {
                data: sportSpaceCreated,
                code: 200,
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