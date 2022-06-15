import { UseCase } from "../../../core/base/usecase";
import { ECompany } from "../../../core/entities/e-company";
import { CompanyRepository } from "../../../infraestructure/user/company.repository";
import { Logger } from "../../../utils/logger";

export class GetCompanyByIdUseCase implements UseCase<String, ECompany>{

    async execute(param: String): Promise<ECompany> {
        try {
            const company: ECompany = await new CompanyRepository().getCompanyById(param);
            return company;
        } catch (error) {
            new Logger().error("CreateCGetCompanyByIdUseCaseompanyUseCase: " , error);
            return Promise.reject(error);
        }
    }

}