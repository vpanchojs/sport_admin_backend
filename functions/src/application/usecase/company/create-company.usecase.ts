import { UseCase } from "../../../core/base/usecase";
import { ECompany } from "../../../core/entities/e-company";
import { CompanyRepository } from "../../../infraestructure/user/company.repository";
import { CCompanyStatus } from "../../../core/entities/enum/c-company-status";
import { Logger } from "../../../utils/logger";
import { CError } from "../../../core/entities/enum/c-error";

export class CreateCompanyUseCase implements UseCase<ECompany, ECompany>{

    async execute(param: ECompany): Promise<ECompany> {        
        try {
            if (param.name == null && param.admin?.account?.accountId == null) {
                Promise.reject(CError.BadRequest);                
            }

            param.status = CCompanyStatus.enable
            const companyCreated = await new CompanyRepository().createCompany(param)

            return companyCreated;
        } catch (error) {            
            const e = new Logger().error("CreateCompanyUseCase", error);
            return Promise.reject(e);
            
        }        
    }

}