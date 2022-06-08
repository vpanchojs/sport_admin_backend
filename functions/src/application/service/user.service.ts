import { EResponse } from "../../core/entities/e-reponse";
import { EUser } from "../../core/entities/e-user";
import { CUserStatus } from "../../core/entities/enum/c-user-state";
import { GetCompanyByIdUseCase } from "../usecase/company/get-company.usecase";
import { CreateUserUseCase } from "../usecase/user/create-user.usecase";
import { GetUserRolUseCase } from "../usecase/user/get-user-rol.usecase";
import { GetUserByIdUseCase } from "../usecase/user/get-user.usecase";
import { SearUserByDniUseCase } from "../usecase/user/search-user-dni-usecase";

export class UserService {

    async createUser(param: EUser): Promise<EResponse<EUser>> {
        param.status = CUserStatus.ACTIVO;
        return await new CreateUserUseCase().execute(param)        
    }

    async getUserById(userId: string): Promise<EResponse<EUser>> {
        let response: EResponse<EUser>;

        let responseGetUser = await new GetUserByIdUseCase().execute(userId);

        if (responseGetUser.data != null) {
            const responseGetUserRol = await new GetUserRolUseCase().execute(userId);
            if (responseGetUserRol.code == 200) {
                if (responseGetUserRol.data != null) {
                    for (const userRol of responseGetUserRol.data!) {
                        if(userRol.company != null){
                           const responseCompany = await new GetCompanyByIdUseCase().execute(userRol.company.companyId!);
                           if(responseCompany.code == 200){
                               userRol.company = responseCompany.data
                           }
                        }
                    }
                }
                responseGetUser.data.roles = responseGetUserRol.data
                response = {
                    code: 200,
                    data: responseGetUser.data
                }                
            } else {
                response = {
                    code: 403,
                    message: 'No se pudo obtener los roles del usuario'
                }
            }
        } else {
            response = {
                code: 404,
                message: "El usuario no existe"
            }
        }

        return response;

    }
    async searchUserByDni(userId: string): Promise<EResponse<EUser>> {
        let response: EResponse<EUser>;
        let responseGetUser = await new SearUserByDniUseCase().execute(userId);
        if (responseGetUser.data != null) {
            response = {
                code: 200,
                data: responseGetUser.data
            }  
        } else {
            response = {
                code: 404,
                message: "El usuario no existe"
            }
        }        
        return response;
    }
    
}