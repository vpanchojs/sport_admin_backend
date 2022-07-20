import { UseCase } from "../../../core/base/usecase";
import { EUser } from "../../../core/entities/e-user";
import { UserRepository } from "../../../infraestructure/user/user.repository";
import { Logger } from "../../../utils/logger";

export class DeleteAccountUseCase implements UseCase<EUser, boolean>{

    async execute(user: EUser): Promise<boolean> {        
        try {
            const userSaved = await new UserRepository().deleteAccount(user.userId!);            
            await new UserRepository().updateStatus(user);
            return userSaved                
        } catch (error) {            
            const e = new Logger().error("DeleteAccountUseCase:", error);
            return Promise.reject(e);
        }
    }

}