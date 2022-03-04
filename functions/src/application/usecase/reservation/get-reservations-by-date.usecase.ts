import { UseCase } from "../../../core/base/usecase";
import { EResponse } from "../../../core/entities/e-reponse";
import * as functions from "firebase-functions";
import { ESearchReservation } from "../../../core/entities/e-search-reservations";
import { ReservationRepository } from "../../../infraestructure/reservation.repository";

export class GetReservationsByDateUseCase implements UseCase<ESearchReservation, EResponse<ESearchReservation>>{

    async execute(param: ESearchReservation): Promise<EResponse<ESearchReservation>> {
        let response: EResponse<ESearchReservation>;
        try {          
            const eSearchReservation = await new ReservationRepository().getReservationsByDate(param)
            response = {
                data: eSearchReservation,
                code: 200,
            }            
        } catch (error) {
            functions.logger.log("GetReservationsByDateUseCase: " + error);
            response = {
                code: 400,
                message: "Problemas al obtener las reservaciones"
            }
        }        
        return response;
    }

}