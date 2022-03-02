import { UseCase } from "../../../core/base/usecase";
import { EResponse } from "../../../core/entities/e-reponse";
import { EUser } from "../../../core/entities/e-user";
import { UserRepository } from "../../../infraestructure/user/user.repository";
import * as functions from "firebase-functions";

export class GetUserByIdUseCase implements UseCase<string, EResponse<EUser>>{

    async execute(userId: string): Promise<EResponse<EUser>> {
        let response: EResponse<EUser>;
        try {
            const userSaved = await new UserRepository().getUser(userId);
            if (userSaved) {
                response = {
                    code: 200,
                    data: userSaved
                }
            } else {
                response = {
                    code: 404,
                    message: "Usuario no encontrado"
                }
            }

        } catch (error) {
            functions.logger.error("GetUserByIdUseCase:" + error);
            response = {
                code: 500,
                message: error + ''
            }
        }

        return response;

    }

}