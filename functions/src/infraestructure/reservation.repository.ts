import { EReservation } from "../core/entities/e-reservation";
import admin = require('firebase-admin');
import { getFirestore } from 'firebase-admin/firestore';
import * as functions from "firebase-functions";
import { CollectionsDB } from "./db/collections";
import { ESearchReservation } from "../core/entities/e-search-reservations";
import { ESchedule } from "../core/entities/e-schedule";
import { EPrice } from "../core/entities/e-price";
import { ESportSpace } from "../core/entities/e-sport-space";
import { EUser } from "../core/entities/e-user";
import { Logger } from "../utils/logger";
import { CError } from "../core/entities/enum/c-error";
import { dateTimeFixedGmt } from "../utils/datetime-gmt";

export class ReservationRepository {
    async createReservation(reservations: Array<EReservation>): Promise<boolean> {
        try {       
            await admin.firestore().runTransaction(async (t) => {                
                for (let reservation of reservations){
                    const uid : string = (dateTimeFixedGmt(reservation.initTime!)+ dateTimeFixedGmt(reservation.endTime!)).toString(); 
                    let reservationDoc = getFirestore().collection(CollectionsDB.company).doc(reservation.schedule!.sportSpace!.company!.companyId!)
                    .collection(CollectionsDB.sportspace).doc(reservation.schedule!.sportSpace!.sportSpaceId!)
                    .collection(CollectionsDB.reservation).doc(uid);                                    
                    const doc = await t.get(reservationDoc);                  
                    if(doc.exists){                     
                        throw CError.AlreadyExists;
                    }
                }
                for (let reservation of reservations){
                    const uid : string = (dateTimeFixedGmt(reservation.initTime!)+ dateTimeFixedGmt(reservation.endTime!)).toString(); 
                    let reservationDoc = getFirestore().collection(CollectionsDB.company).doc(reservation.schedule!.sportSpace!.company!.companyId!)
                    .collection(CollectionsDB.sportspace).doc(reservation.schedule!.sportSpace!.sportSpaceId!)
                    .collection(CollectionsDB.reservation).doc(uid);                                                                                
                    t.set(reservationDoc, this.EReservateToParam(reservation))                                                                   
                }
            });
            return true;
        } catch (e) {            
            const error = new Logger().error("ReservationRepository - createReservation :", e)
            return Promise.reject(error);
        }
    }

    EReservateToParam(reservation: EReservation): any{
        let data = {
                'status':reservation.status,
                "scheduleId": reservation.schedule?.scheduleId,
                "initTime": new Date(reservation.initTime! + ((5 * 60)* 60000)),
                "endTime": new Date(reservation.endTime ! + ((5 * 60)* 60000)),
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
                "ownerDate": reservation.ownerDate
            };
        return data;
    }

    async cancelReservation(reservation: EReservation): Promise<EReservation> {
        try {
            let data = {
                'status': reservation.status,
                'observation':reservation.observation,
                'updated': admin.firestore.FieldValue.serverTimestamp()
            };
            let doc = getFirestore().collection(CollectionsDB.company).doc(reservation.schedule!.sportSpace!.company!.companyId!)
                                    .collection(CollectionsDB.sportspace).doc(reservation.schedule!.sportSpace!.sportSpaceId!)
                                    .collection(CollectionsDB.reservation).doc(reservation.reservationId!);
            await doc.update(data)
            reservation.updated = new Date().getTime();
            reservation.reservationId = doc.id;
            return reservation;
        } catch (e) {
            functions.logger.error("Error al ReservationRepository - cancelReservation :" + e);
            return Promise.reject(e);
        }
    }

    async getReservationsByDate(search: ESearchReservation): Promise<ESearchReservation> {
        try {
            functions.logger.info("ReservationRepository - getReservationsByDate :" + search.date!.toString());
            let snapshot =  await getFirestore().collection(CollectionsDB.company).doc(search.sportSpace!.company!.companyId!)
            .collection(CollectionsDB.sportspace).doc(search.sportSpace!.sportSpaceId!)
            .collection(CollectionsDB.reservation).where("ownerDate", "==", search.date!).get()

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
                    initTime: data.initTime.toDate().getTime() - ((5 * 60)* 60000),
                    endTime: data.endTime.toDate().getTime()- ((5 * 60)* 60000),
                    observation: data.observation,
                    created: data.created.toDate().getTime() - ((5 * 60)* 60000),
                    updated: (data.update != null ) ?  data.updated?.toDate()?.getTime() - ((5 * 60)* 60000) : data.created.toDate().getTime() - ((5 * 60)* 60000),
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
            functions.logger.error("Error al ReservationRepository - getReservationsByDate :" + e);
            return Promise.reject(e);
        }
    }

    async completeReservation(reservation: EReservation): Promise<EReservation> {
        try {
            let data = {
                'status': reservation.status,
                'observation':reservation.observation,
                'updated': admin.firestore.FieldValue.serverTimestamp()
            };
            let doc = getFirestore().collection(CollectionsDB.company).doc(reservation.schedule!.sportSpace!.company!.companyId!)
                                    .collection(CollectionsDB.sportspace).doc(reservation.schedule!.sportSpace!.sportSpaceId!)
                                    .collection(CollectionsDB.reservation).doc(reservation.reservationId!);
            await doc.update(data)
            reservation.reservationId = doc.id;
            reservation.updated = new Date().getTime();
            return reservation;
        } catch (e) {
            functions.logger.error("Error al ReservationRepository - completeReservation :" + e);
            return Promise.reject(e);
        }
    }

    async playingReservation(reservation: EReservation): Promise<EReservation> {
        try {
            let data = {
                'status': reservation.status,
                'observation':reservation.observation,
                'updated': admin.firestore.FieldValue.serverTimestamp()
            };
            let doc = getFirestore().collection(CollectionsDB.company).doc(reservation.schedule!.sportSpace!.company!.companyId!)
                                    .collection(CollectionsDB.sportspace).doc(reservation.schedule!.sportSpace!.sportSpaceId!)
                                    .collection(CollectionsDB.reservation).doc(reservation.reservationId!);
            await doc.update(data)
            reservation.reservationId = doc.id;
            reservation.updated = new Date().getTime();
            return reservation;
        } catch (e) {
            functions.logger.error("Error al ReservationRepository - playingReservation :" + e);
            return Promise.reject(e);
        }
    }
    async deleteReservation(reservation: EReservation): Promise<EReservation> {
        try {          
            let doc = getFirestore().collection(CollectionsDB.company).doc(reservation.schedule!.sportSpace!.company!.companyId!)
                                    .collection(CollectionsDB.sportspace).doc(reservation.schedule!.sportSpace!.sportSpaceId!)
                                    .collection(CollectionsDB.reservation).doc(reservation.reservationId!);
            await doc.delete()
            return reservation;
        } catch (e) {
            functions.logger.error("Error al ReservationRepository - deleteReservation :" + e);
            return Promise.reject(e);
        }
    }
}