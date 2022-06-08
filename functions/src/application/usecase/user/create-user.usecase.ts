import { UseCase } from "../../../core/base/usecase";
import { EResponse } from "../../../core/entities/e-reponse";
import { EUser } from "../../../core/entities/e-user";
import { CUserStatus } from "../../../core/entities/enum/c-user-state";
import { UserRepository } from "../../../infraestructure/user/user.repository";
import * as functions from "firebase-functions";


export class CreateUserUseCase implements UseCase<EUser, EResponse<EUser>>{

    async execute(param: EUser): Promise<EResponse<EUser>> {
        try {
            if (param.gender != null && param.name != null && param.lastName != null && param.dni != null) {
                return {
                    code: 400,
                    message: "Faltan algunos campos requeridos"
                }
            }
            param.account?.email?.trim(); 
            //CUserStatus.ACTIVO si es creado desde el regitro de cuenta normal
            if(param.status == CUserStatus.ACTIVO){
                const user: EUser|null = await new UserRepository().searchUserByDni(param.dni!);                
                //Si el usuario tiene usuario y cuenta
                if(user != null && user.status == CUserStatus.ACTIVO){
                    return {
                        code: 400,
                        message: "La identificación se ecuentra registrada en una cuenta"
                    }
                }  
                param.account!.accountId=user?.account?.accountId;           
                const accountId: string = await new UserRepository().createUser(param);                
                if(user?.status == CUserStatus.REGISTRO_PENDIENTE){
                    const updateUser: EUser = await new UserRepository().updateUser(param);
                    if (updateUser) {
                        return {
                            data: updateUser,
                            code: 200,
                        }
                    } else {
                        return {
                            code: 404,
                            message: "Usuario no encontrado"
                        }
                    }
                }
                param.account!.accountId = accountId;
            }
            const userCreated = await new UserRepository().savedUser(param)
            return {
                data: userCreated,
                code: 200,
            }
        } catch (e) {
            functions.logger.error("CreateUserUseCase :" + e);
            return  {
                code: 400,
                message: e + ''
            }
        }
    }

}