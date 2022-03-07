import { EResponse } from "../../core/entities/e-reponse";
import { EReservation } from "../../core/entities/e-reservation";
import { ESearchReservation } from "../../core/entities/e-search-reservations";
import { CancelReservationUseCase } from "../usecase/reservation/cancel-reservation.usecase";
import { CompleteReservationUseCase } from "../usecase/reservation/complete-reservation.usecase";
import { CreateReservationUseCase } from "../usecase/reservation/create-reservation.usecase";
import { GetReservationsByDateUseCase } from "../usecase/reservation/get-reservations-by-date.usecase";
import { PlayingReservationUseCase } from "../usecase/reservation/playing-reservation.usecase";

export class ReservationService {

    async createReservation(reservation: EReservation): Promise<EResponse<EReservation>> {
        let response: EResponse<EReservation>;
        // Crear la compañia,         
       const companyCreated = await new CreateReservationUseCase().execute(reservation);

       if(companyCreated.data == null){
            response = {
                code: 400,
                message: companyCreated.message
            }
       }else{
           return companyCreated;
       } 
       return response;
        
    }

    async cancelReservation(reservation: EReservation): Promise<EResponse<EReservation>> {
        let response: EResponse<EReservation>;      
       const cancelledReservation = await new CancelReservationUseCase().execute(reservation);

       if(cancelledReservation.data == null){
            response = {
                code: 400,
                message: cancelledReservation.message
            }
       }else{
           return cancelledReservation;
       } 
       return response;
        
    }

    async getReservationsByDate(search: ESearchReservation): Promise<EResponse<ESearchReservation>> {
        let response: EResponse<ESearchReservation>;      
       const reponse = await new GetReservationsByDateUseCase().execute(search);

       if(reponse.data == null){
            response = {
                code: 400,
                message: reponse.message
            }
       }else{
           return reponse;
       } 
       return response;
        
    }

    async playingReservation(reservation: EReservation): Promise<EResponse<EReservation>> {
        let response: EResponse<EReservation>;      
       const playingReservation = await new PlayingReservationUseCase().execute(reservation);

       if(playingReservation.data == null){
            response = {
                code: 400,
                message: playingReservation.message
            }
       }else{
           return playingReservation;
       } 
       return response;
        
    }

    async completeReservation(reservation: EReservation): Promise<EResponse<EReservation>> {
        let response: EResponse<EReservation>;      
       const completedReservation = await new CompleteReservationUseCase().execute(reservation);

       if(completedReservation.data == null){
            response = {
                code: 400,
                message: completedReservation.message
            }
       }else{
           return completedReservation;
       } 
       return response;
        
    }
}