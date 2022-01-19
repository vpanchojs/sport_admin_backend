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
            response = {
                code: 500,
                message: "GetCompanyUseCase - Problemas al procesar la solicitud"
            }
        }

        return response;
    }

}