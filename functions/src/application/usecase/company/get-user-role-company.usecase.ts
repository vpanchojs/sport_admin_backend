import { UseCase } from "../../../core/base/usecase";
import { EUserRol } from "../../../core/entities/e-user-rol";
import { CompanyRepository } from "../../../infraestructure/user/company.repository";
import { Logger } from "../../../utils/logger";

export class GetUserRolCompanyUseCase implements UseCase<EUserRol, EUserRol>{

    async execute(param: EUserRol): Promise<EUserRol> {            
        try {        
            const userRole: EUserRol = await new CompanyRepository().getUserRoleCompany(param);
            return userRole;
        } catch (error) {
            const e = new Logger().error("GetUserRolCompanyUseCase", error);
            return Promise.reject(e);                     
        }        
    }

}