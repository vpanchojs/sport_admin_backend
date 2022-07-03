import { UseCase } from "../../../core/base/usecase";
import { EUser } from "../../../core/entities/e-user";
import { UserRepository } from "../../../infraestructure/user/user.repository";
import { Logger } from "../../../utils/logger";

export class SearchUserByDniUseCase implements UseCase<string, EUser>{

    async execute(userId: string): Promise<EUser> {        
        try {
            const userSaved = await new UserRepository().searchUserByDni(userId);
            return userSaved                
        } catch (error) {            
            const e = new Logger().error("SearchUserByIdUseCase:", error);
            return Promise.reject(e);
        }
    }

}