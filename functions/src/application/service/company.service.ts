import { ECompany } from "../../core/entities/e-company";
import { EResponse } from "../../core/entities/e-reponse";
import { EUserRol } from "../../core/entities/e-user-rol";
import { CRol } from "../../core/entities/enum/c-rol";
import { CreateCompanyUseCase } from "../usecase/company/create-company.usecase";
import { CreateRoleUserUseCase } from "../usecase/user/create-role-user.usecase";

export class CompanyService {

    async createCompany(company:ECompany): Promise<EResponse<EUserRol>> {
        let response: EResponse<EUserRol>;
      
       const companyCreated = await new CreateCompanyUseCase().execute(company);

       if(companyCreated.data == null){
            response = {
                code: 400,
                message: companyCreated.message
            }
       } else {
           let userRole: EUserRol = {
               company:companyCreated.data,
               role: { code: CRol.companyAdmin },
               user:company.admin
           }
           const userRolCreated = await new CreateRoleUserUseCase().execute(userRole);
           if(userRolCreated.data != null){
                response ={
                    code: 200,
                    message: 'Compañia creada',
                    data:userRolCreated.data
                }
           } else {
                response = {
                    code: 400,
                    message: userRolCreated.message
                }
           }
       }

       return response;
        
    }
}