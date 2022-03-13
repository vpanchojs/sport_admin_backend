import * as functions from "firebase-functions";
import { UseCase } from "../../../core/base/usecase";
import { ECompany } from "../../../core/entities/e-company";
import { EResponse } from "../../../core/entities/e-reponse";
import { CompanyRepository } from "../../../infraestructure/user/company.repository";

export class GetCompanyByIdUseCase implements UseCase<String, EResponse<ECompany>>{

    async execute(param: String): Promise<EResponse<ECompany>> {
        let response: EResponse<ECompany>;
        try {
            const companySaved = await new CompanyRepository().getCompanyById(param);
            if (companySaved) {
                response = {
                    code: 200,
                    data: companySaved
                }
            } else {
                response = {
                    code: 404,
                    message: "Company no encontrado"
                }
            }

        } catch (error) {
            functions.logger.error("CreateCGetCompanyByIdUseCaseompanyUseCase: " + error);
            response = {
                code: 500,
                message: "Problemas al obtener la compañia"
            }
        }

        return response;
    }

}