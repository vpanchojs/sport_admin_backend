import { UseCase } from "../../../core/base/usecase";
import { ECompany } from "../../../core/entities/e-company";
import { EUserRol } from "../../../core/entities/e-user-rol";
import { CompanyRepository } from "../../../infraestructure/user/company.repository";
import { Logger } from "../../../utils/logger";

export class GetCompanyRolesUseCase implements UseCase<ECompany, EUserRol[]>{

    async execute(param: ECompany): Promise<EUserRol[]> {
        try {            
            const roles: EUserRol[] = await new CompanyRepository().getCompanyRoles(param);
            return roles;
        } catch (error) {
            const e = new Logger().error("GetCompanyRolesUseCase", error);
            return Promise.reject(e);
        }
    }

}