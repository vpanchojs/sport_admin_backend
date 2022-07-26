import { UseCase } from "../../../core/base/usecase";
import { EUser } from "../../../core/entities/e-user";
import { CError } from "../../../core/entities/enum/c-error";
import { CUserStatus } from "../../../core/entities/enum/c-user-state";
import { UserRepository } from "../../../infraestructure/user/user.repository";
import { Logger } from "../../../utils/logger";

export class SearchUserByDniUseCase implements UseCase<string, EUser>{

    async execute(userId: string): Promise<EUser> {        
        try {
            const userSaved = await new UserRepository().searchUserByDni(userId);
            if(userSaved?.status == CUserStatus.ELIMINADO || userSaved?.status == CUserStatus.INACTIVO){
                return Promise.reject(CError.FailedPrecondition);
            } 
            return userSaved                
        } catch (error) {            
            const e = new Logger().error("SearchUserByIdUseCase:", error);
            return Promise.reject(e);
        }
    }

}