import { UseCase } from "../../../core/base/usecase";
import { EUserRol } from "../../../core/entities/e-user-rol";
import { CRoleStatus } from "../../../core/entities/enum/c-role-status";
import { CompanyRepository } from "../../../infraestructure/user/company.repository";
import { Logger } from "../../../utils/logger";

export class RemoveRoleCompanyUseCase implements UseCase<EUserRol, boolean>{

    async execute(param: EUserRol): Promise<boolean> {
        try {
            param.status = CRoleStatus.disable;            
            const removed = await new CompanyRepository().removeCompanyRole(param)
            return removed;
        } catch (error) {            
            const e = new Logger().error("RemoveRoleCompanyUseCase", error);
            return Promise.reject(e);
        }
    
    }

}