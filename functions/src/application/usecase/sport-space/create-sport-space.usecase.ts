import { UseCase } from "../../../core/base/usecase";
import { ESportSpace } from "../../../core/entities/e-sport-space";
import { CSportSpaceStatus } from "../../../core/entities/enum/c-sport-space-status";
import { SportSpaceRepository } from "../../../infraestructure/user/sport-space.repository";
import { Logger } from "../../../utils/logger";

export class CreateSportSpaceUseCase implements UseCase<ESportSpace, ESportSpace>{

    async execute(param: ESportSpace): Promise<ESportSpace> {        
        try {

            param.status = CSportSpaceStatus.enable         
            const sportSpaceCreated = await new SportSpaceRepository().createSportSpace(param)          
            return sportSpaceCreated;                                  
        } catch (error) {
            const e = new Logger().error("CreateSportSpaceUseCase", error);
            return Promise.reject(e);
        }                
    }

}