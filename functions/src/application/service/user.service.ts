import { EResponse } from "../../core/entities/e-reponse";
import { EUser } from "../../core/entities/e-user";
import { CUserStatus } from "../../core/entities/enum/c-user-state";
import { Logger } from "../../utils/logger";
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

    async getUserById(userId: string): Promise<EUser> {        
        try {
            const user = await new GetUserByIdUseCase().execute(userId);
            const roles = await new GetUserRolUseCase().execute(userId);

            for (const userRol of roles) {
                if(userRol.company != null){
                    try {
                        const company = await new GetCompanyByIdUseCase().execute(userRol.company.companyId!);
                        userRol.company = company;     
                    }finally{}               
                }
            }

            user.roles = roles;

            return user;
            
        } catch (error) {
            const e = new Logger().error("UserService - getUserById", error);
            return Promise.reject(e);
        }
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