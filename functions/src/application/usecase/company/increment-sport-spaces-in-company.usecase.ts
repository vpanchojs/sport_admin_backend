import { UseCase } from "../../../core/base/usecase";
import { CompanyRepository } from "../../../infraestructure/user/company.repository";
import { Logger } from "../../../utils/logger";

export class IncrementSportSpacesInCompanyUseCase implements UseCase<String, void>{

    async execute(companyId: String): Promise<void> {        
        try {          
            await new CompanyRepository().incrementeSportSpacesInCompany(companyId);        
            return;
        } catch (error) {
            const e = new Logger().error("CompanyService - createCompany", error);
            return Promise.reject(e);
        }                
    }

}