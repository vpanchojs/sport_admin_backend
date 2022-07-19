import { UseCase } from "../../../core/base/usecase";
import { EAccount } from "../../../core/entities/e-account";
import { UserRepository } from "../../../infraestructure/user/user.repository";
import { Logger } from "../../../utils/logger";

export class GetAccountByEmailUseCase implements UseCase<string, EAccount>{

    async execute(email: string): Promise<EAccount> {        
        try {
            const account: EAccount = await new UserRepository().getAccountByEmail(email);
            return account                
        } catch (error) {            
            const e = new Logger().error("GetAccountByEmailUseCase:", error);
            return Promise.reject(e);
        }
    }

}