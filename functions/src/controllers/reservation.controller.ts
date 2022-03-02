import * as functions from "firebase-functions";
import { ReservationService } from "../application/service/reservation.service";
import { EResponse } from "../core/entities/e-reponse";
import { EReservation } from "../core/entities/e-reservation";

export const createReservation = functions.https.onCall(async (data, context) => {
  console.log('data', data);

  const response: EResponse<EReservation> = await new ReservationService().createReservation(data);
  return response;

});

export const cancelReservation = functions.https.onCall(async (data, context) => {
  console.log('data', data);

  const response: EResponse<EReservation> = await new ReservationService().createReservation(data);
  return response;

});