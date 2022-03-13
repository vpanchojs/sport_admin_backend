import { UseCase } from "../../../core/base/usecase";
import { ECompany } from "../../../core/entities/e-company";
import { EResponse } from "../../../core/entities/e-reponse";
import { CompanyRepository } from "../../../infraestructure/user/company.repository";
import * as functions from "firebase-functions";
import { CCompanyStatus } from "../../../core/entities/enum/c-company-status";

export class CreateCompanyUseCase implements UseCase<ECompany, EResponse<ECompany>>{

    async execute(param: ECompany): Promise<EResponse<ECompany>> {
        let response: EResponse<ECompany>;
        try {
            if (param.name == null && param.admin?.account?.accountId == null) {
                return response = {
                    code: 400,
                    message: "Faltan algunos campos requeridos"
                }
            }

            param.status = CCompanyStatus.enable         
        
            const companyCreated = await new CompanyRepository().createCompany(param)
            response = {
                data: companyCreated,
                code: 200,
            }
        } catch (error) {
            functions.logger.error("CreateCompanyUseCase: " + error);
            response = {
                code: 400,
                message: "Problemas al crear la compañia"
            }
        }
        return response;
    }

}