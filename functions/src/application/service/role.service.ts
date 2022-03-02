import { EResponse } from "../../core/entities/e-reponse";
import { GetUserRolUseCase } from "../usecase/user/get-user-rol.usecase";

export class RoleServicie {

    async verifyAccessByRole(uid: string, companyId: string, roles: string[]): Promise<EResponse<boolean>> {
        let response: EResponse<boolean>;
        // Get roles of user,         
       const userRoles = (await new GetUserRolUseCase().execute(uid)).data;

       if(userRoles !=null ){
            //Verified role by company
            const rolesByCompany =  userRoles!.filter(rol => rol.company?.companyId == companyId &&  roles.includes(rol.role!.code!));
            if(rolesByCompany.length > 0){
                response = {
                    code: 200,
                    message: 'Autorizado'
                }
            }else{
                response = {
                    code: 401,
                    message: 'No autorizado'
                }    
            }
       }else{
            response = {
                code: 401,
                message: 'No autorizado'
            }
       }
       return response;
        
    }
}