import { UseCase } from "../../../core/base/usecase";
import { EResponse } from "../../../core/entities/e-reponse";
import * as functions from "firebase-functions";
import { EPrice } from "../../../core/entities/e-price";
import { PriceRepository } from "../../../infraestructure/price.repository";
import { CPriceStatus } from "../../../core/entities/enum/c-price-status";

export class CreatePriceUseCase implements UseCase<EPrice, EResponse<EPrice>>{

    async execute(param: EPrice): Promise<EResponse<EPrice>> {
        let response: EResponse<EPrice>;
        try {              
            param.status = CPriceStatus.enable         
        
            const priceCreated = await new PriceRepository().createPrice(param)
            response = {
                data: priceCreated,
                code: 200,
            }
        } catch (error) {
            functions.logger.log("CreatePriceUseCase: " + error);
            response = {
                code: 400,
                message: "Problemas al crear el create price"
            }
        }        
        return response;
    }

}