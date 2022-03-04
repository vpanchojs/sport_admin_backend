import { EResponse } from "../../core/entities/e-reponse";
import { EReservation } from "../../core/entities/e-reservation";
import { ESearchReservation } from "../../core/entities/e-search-reservations";
import { CreateReservationUseCase } from "../usecase/reservation/create-reservation.usecase";
import { GetReservationsByDateUseCase } from "../usecase/reservation/get-reservations-by-date.usecase";

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
       const companyCanceled = await new CreateReservationUseCase().execute(reservation);

       if(companyCanceled.data == null){
            response = {
                code: 400,
                message: companyCanceled.message
            }
       }else{
           return companyCanceled;
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
}