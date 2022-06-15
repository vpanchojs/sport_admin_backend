import { EUser } from "../../../core/entities/e-user";
import { UserRepository } from "../../../infraestructure/user/user.repository";
import { Logger } from "../../../utils/logger";
import { UseCase } from "../../../core/base/usecase";

export class GetUserByIdUseCase implements UseCase<string, EUser>{

    async execute(userId: string): Promise<EUser> {
        try {
            const userSaved = await new UserRepository().getUser(userId);
            return userSaved
        } catch (error) {
            const e = new Logger().error("GetUserByIdUseCase:", error)
            return Promise.reject(e);
        }
    }

}