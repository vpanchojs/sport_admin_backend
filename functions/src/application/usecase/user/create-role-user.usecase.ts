import * as functions from "firebase-functions";
import { UseCase } from "../../../core/base/usecase";
import { EResponse } from "../../../core/entities/e-reponse";
import { EUserRol } from "../../../core/entities/e-user-rol";
import { UserRepository } from "../../../infraestructure/user/user.repository";


export class CreateRoleUserUseCase implements UseCase<EUserRol, EResponse<EUserRol>>{

    async execute(param: EUserRol): Promise<EResponse<EUserRol>> {
        let response: EResponse<EUserRol>;
        try {
            if (param.user == null || param.role == null) {
                return response = {
                    code: 400,
                    message: "Faltan algunos campos requeridos"
                }
            }
            const roleCreated = await new UserRepository().createUserRol(param)
            response = {
                data: roleCreated,
                code: 200,
            }
        } catch (error) {
            functions.logger.info("CreateRoleUserUseCase :" + error);
            response = {
                code: 400,
                message: "Problemas al crear el rol para el usuario"
            }
        }
        return response;
    }

}