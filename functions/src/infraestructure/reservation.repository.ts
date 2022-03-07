import { EReservation } from "../core/entities/e-reservation";
import admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
import * as functions from "firebase-functions";
import { CollectionsDB } from "./db/collections";
import { ESearchReservation } from "../core/entities/e-search-reservations";
import { ESchedule } from "../core/entities/e-schedule";
import { EPrice } from "../core/entities/e-price";
import { ESportSpace } from "../core/entities/e-sport-space";
import { EUser } from "../core/entities/e-user";

export class ReservationRepository {
    async createReservation(reservation: EReservation): Promise<EReservation> {
        try {
            const ownerDate = new Date(reservation.initTime!);
            let data = {
                'status': reservation.status,
                "scheduleId": reservation.schedule?.scheduleId,
                "initTime": reservation.initTime,
                "endTime": reservation.endTime,
                'observation': reservation.observation,
                'created': admin.firestore.FieldValue.serverTimestamp(),
                "priceId": reservation.price.priceId,
                "sportSpaceId": reservation.schedule?.sportSpace?.sportSpaceId,
                "client":{
                    "userId": reservation.client?.userId,
                    "name": reservation.client?.name,
                    "lastName": reservation.client?.lastName,
                    "dni": reservation.client?.dni
                },
                "ownerDate": ownerDate.getFullYear().toString() +ownerDate.getMonth().toString() + ownerDate.getDay().toString()
            };
            let doc = getFirestore().collection(CollectionsDB.company).doc(reservation.schedule?.sportSpace!.company?.companyId)
                                    .collection(CollectionsDB.sportspace).doc(reservation.schedule?.sportSpace?.sportSpaceId)
                                    .collection(CollectionsDB.reservation).doc();
            await doc.create(data)
            reservation.reservationId = doc.id;
            return reservation;
        } catch (e) {
            functions.logger.log("Error al ReservationRepository - createReservation :" + e);
            return Promise.reject(e);
        }
    }

    async cancelReservation(reservation: EReservation): Promise<EReservation> {
        try {
            let data = {
                'status': reservation.status,
                'updated': admin.firestore.FieldValue.serverTimestamp()
            };
            let doc = getFirestore().collection(CollectionsDB.company).doc(reservation.schedule?.sportSpace!.company?.companyId)
                                    .collection(CollectionsDB.sportspace).doc(reservation.schedule?.sportSpace?.sportSpaceId)
                                    .collection(CollectionsDB.reservation).doc(reservation.reservationId);
            await doc.update(data)
            reservation.updated = new Date();
            reservation.reservationId = doc.id;
            return reservation;
        } catch (e) {
            functions.logger.log("Error al ReservationRepository - cancelReservation :" + e);
            return Promise.reject(e);
        }
    }

    async getReservationsByDate(search: ESearchReservation): Promise<ESearchReservation> {
        try {
            const ownerDate = new Date(search.date!);
            let snapshot =  await getFirestore().collection(CollectionsDB.company).doc(search.sportSpace!.company?.companyId)
            .collection(CollectionsDB.sportspace).doc(search.sportSpace?.sportSpaceId)
            .collection(CollectionsDB.reservation).where("ownerDate", "==", ownerDate.getFullYear().toString() +ownerDate.getMonth().toString() + ownerDate.getDay().toString()).get()

            let reservations: EReservation[] = [];
            if (snapshot.empty) {
                console.log('No matching documents.');
                search.reservations = reservations;
                return search;
            }

            snapshot.forEach((doc: any) => {
                const data = doc.data();
                reservations.push(<EReservation>{
                    reservationId: doc.id,
                    schedule:<ESchedule>{
                        scheduleId: data.scheduleId,
                        sportSpace: <ESportSpace>{
                            sportSpaceId: data.sportSpaceId
                        }                        
                    },
                    initTime: data.initTime,
                    endTime: data.endTime,
                    observation: data.observation,
                    created: data.created,
                    updated: data.updated,
                    price: <EPrice>{
                        priceId: data.priceId
                    },
                    status: data.status,
                    client: <EUser> {
                        account: {
                            accountId: data.client['userId'],
                        }, 
                        dni: data.client['dni'],
                        name: data.client['name'],
                        lastName: data.client['lastName']
                    }
                });
            });
            search.reservations = reservations;
            return search;
        } catch (e) {
            functions.logger.log("Error al ReservationRepository - getReservationsByDate :" + e);
            return Promise.reject(e);
        }
    }

    async completeReservation(reservation: EReservation): Promise<EReservation> {
        try {
            let data = {
                'status': reservation.status,
                'updated': admin.firestore.FieldValue.serverTimestamp()
            };
            let doc = getFirestore().collection(CollectionsDB.company).doc(reservation.schedule?.sportSpace!.company?.companyId)
                                    .collection(CollectionsDB.sportspace).doc(reservation.schedule?.sportSpace?.sportSpaceId)
                                    .collection(CollectionsDB.reservation).doc(reservation.reservationId);
            await doc.update(data)
            reservation.reservationId = doc.id;
            reservation.updated = new Date();
            return reservation;
        } catch (e) {
            functions.logger.log("Error al ReservationRepository - completeReservation :" + e);
            return Promise.reject(e);
        }
    }

    async playingReservation(reservation: EReservation): Promise<EReservation> {
        try {
            let data = {
                'status': reservation.status,
                'updated': admin.firestore.FieldValue.serverTimestamp()
            };
            let doc = getFirestore().collection(CollectionsDB.company).doc(reservation.schedule?.sportSpace!.company?.companyId)
                                    .collection(CollectionsDB.sportspace).doc(reservation.schedule?.sportSpace?.sportSpaceId)
                                    .collection(CollectionsDB.reservation).doc(reservation.reservationId);
            await doc.update(data)
            reservation.reservationId = doc.id;
            reservation.updated = new Date();
            return reservation;
        } catch (e) {
            functions.logger.log("Error al ReservationRepository - playingReservation :" + e);
            return Promise.reject(e);
        }
    }
}