import { UseCase } from "../../../core/base/usecase";
import { EResponse } from "../../../core/entities/e-reponse";
import { EUser } from "../../../core/entities/e-user";
import { CUserStatus } from "../../../core/entities/enum/c-user-state";
import { UserRepository } from "../../../infraestructure/user/user.repository";
import * as functions from "firebase-functions";


export class CreateUserUseCase implements UseCase<EUser, EResponse<EUser>>{

    async execute(param: EUser): Promise<EResponse<EUser>> {
        let response: EResponse<EUser>;
        try {
            if (param.gender != null && param.name != null && param.lastName != null) {
                return response = {
                    code: 400,
                    message: "Faltan algunos campos requeridos"
                }
            }

            param.status = CUserStatus.ACTIVO 
            const accountId: string = await new UserRepository().createUser(param);
            param.account!.accountId = accountId;
            const userCreated = await new UserRepository().savedUser(param)
            response = {
                data: userCreated,
                code: 200,
            }
        } catch (e) {
            functions.logger.error("CreateUserUseCase :" + e);
            response = {
                code: 400,
                message: e + ''
            }
        }
        return response;
    }

}