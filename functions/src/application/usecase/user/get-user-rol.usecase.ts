import { UseCase } from "../../../core/base/usecase";
import { EResponse } from "../../../core/entities/e-reponse";
import { EUserRol } from "../../../core/entities/e-user-rol";
import { UserRepository } from "../../../infraestructure/user/user.repository";

export class GetUserRolUseCase implements UseCase<string, EResponse<EUserRol[]>>{

    async execute(param: string): Promise<EResponse<EUserRol[]>> {
        let response: EResponse<EUserRol[]>;
                
        try {        
            const userRoles:EUserRol[] | null = await new UserRepository().getUserRol(param);
            if(userRoles !=null){
                response = {
                    data: userRoles!,
                    code: 200,
                }
            }else{
                response = {                    
                    code: 200,
                    message:'No tiene ningun rol asignado'
                }
            }            
        } catch (error) {
            response = {
                code: 400,
                message: "Problemas al obtener los roles del usuario"
            }
        }
        return response;
    }

}