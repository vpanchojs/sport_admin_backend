import { UseCase } from "../../../core/base/usecase";
import { EResponse } from "../../../core/entities/e-reponse";
import { ESportSpace } from "../../../core/entities/e-sport-space";
import * as functions from "firebase-functions";
import { SportSpaceRepository } from "../../../infraestructure/user/sport-space.repository";
import { ECompany } from "../../../core/entities/e-company";

export class GetAllSportSpaceByCompanyUseCase implements UseCase<ECompany, EResponse<ESportSpace[]>>{

    async execute(param: ECompany): Promise<EResponse<ESportSpace[]>> {
        let response: EResponse<ESportSpace[]>;
        try {          
            const sportSpaces = await new SportSpaceRepository().getAllSportSpacesByCompany(param)
            response = {
                data: sportSpaces,
                code: 200,
            }            
        } catch (error) {
            functions.logger.log("GetAllSportSpaceByCompanyUseCase: " + error);
            response = {
                code: 400,
                message: "Problemas al obtener los space sport"
            }
        }        
        return response;
    }

}