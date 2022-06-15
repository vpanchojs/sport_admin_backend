import { UseCase } from "../../../core/base/usecase";
import { EUserRol } from "../../../core/entities/e-user-rol";
import { UserRepository } from "../../../infraestructure/user/user.repository";
import { Logger } from "../../../utils/logger";

export class GetUserRolUseCase implements UseCase<string, EUserRol[]>{

    async execute(param: string): Promise<EUserRol[]> {            
        try {        
            const userRoles: EUserRol[] = await new UserRepository().getUserRol(param);
            return userRoles;            
        } catch (error) {
            const e = new Logger().error("GetUserRolUseCase", error);
            return Promise.reject(e);                     
        }        
    }

}