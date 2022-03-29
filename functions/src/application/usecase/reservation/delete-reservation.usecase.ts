import { UseCase } from "../../../core/base/usecase";
import { EResponse } from "../../../core/entities/e-reponse";
import { EReservation } from "../../../core/entities/e-reservation";
import * as functions from "firebase-functions";
import { ReservationRepository } from "../../../infraestructure/reservation.repository";
import { CReservationStatus } from "../../../core/entities/enum/c-reservation-status";

export class DeleteReservationUseCase implements UseCase<EReservation, EResponse<EReservation>>{

    async execute(param: EReservation): Promise<EResponse<EReservation>> {
        let response: EResponse<EReservation>;
        try {
            param.status = CReservationStatus.pending
            const reservationDeleted = await new ReservationRepository().deleteReservation(param)
            response = {
                data: reservationDeleted,
                code: 200,
            }
        } catch (error) {
            functions.logger.log("DeleteReservationUseCase: " + error);
            response = {
                code: 400,
                message: "Problemas al cancelar la reserva"
            }
        }        
        return response;
    }

}