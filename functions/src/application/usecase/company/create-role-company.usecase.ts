import { UseCase } from "../../../core/base/usecase";
import { EUserRol } from "../../../core/entities/e-user-rol";
import { CRoleStatus } from "../../../core/entities/enum/c-role-status";
import { CompanyRepository } from "../../../infraestructure/user/company.repository";
import { Logger } from "../../../utils/logger";


export class CreateRoleCompanyUseCase implements UseCase<EUserRol, EUserRol>{

    async execute(param: EUserRol): Promise<EUserRol> {
        try {
            param.status = CRoleStatus.enable;
            const roleCreated = await new CompanyRepository().createCompanyRol(param)
            return roleCreated;
        } catch (error) {            
            const e = new Logger().error("CreateRoleUserUseCase", error);
            return Promise.reject(e);
        }
    
    }

}