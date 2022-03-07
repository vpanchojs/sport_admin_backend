import * as functions from "firebase-functions";
import { ReservationService } from "../application/service/reservation.service";
import { EResponse } from "../core/entities/e-reponse";
import { EReservation } from "../core/entities/e-reservation";
import { ESearchReservation } from "../core/entities/e-search-reservations";

export const createReservation = functions.https.onCall(async (data, context) => {
  console.log('data', data);

  const response: EResponse<EReservation> = await new ReservationService().createReservation(data);
  return response;

});

export const cancelReservation = functions.https.onCall(async (data, context) => {
  console.log('data', data);

  const response: EResponse<EReservation> = await new ReservationService().cancelReservation(data);
  return response;

});

export const getByDay = functions.https.onCall(async (data, context) => {
  console.log('data', data);

  const response: EResponse<ESearchReservation> = await new ReservationService().getReservationsByDate(data);
  return response;
});

export const playingReservation = functions.https.onCall(async (data, context) => {
  console.log('data', data);

  const response: EResponse<EReservation> = await new ReservationService().playingReservation(data);
  return response;

});

export const completeReservation = functions.https.onCall(async (data, context) => {
  console.log('data', data);

  const response: EResponse<EReservation> = await new ReservationService().completeReservation(data);
  return response;

});

