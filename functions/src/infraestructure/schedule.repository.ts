import { ESchedule } from "../core/entities/e-schedule";
import admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
import * as functions from "firebase-functions";
import { CollectionsDB } from "./db/collections";
import { ESportSpace } from "../core/entities/e-sport-space";

export class ScheduleRepository {
    async createSchedule(schedule: ESchedule): Promise<ESchedule> {
        try {
            let data = {
                "category": schedule.category,
                "days": schedule.days,
                'status': schedule.status,
                "initHour": schedule.initHour,
                "endHour": schedule.endHour,
                "created": admin.firestore.FieldValue.serverTimestamp(),
                "sportSpaceId": schedule.sportSpace?.sportSpaceId
            };
            let doc = getFirestore().collection(CollectionsDB.company).doc(schedule.sportSpace!.company?.companyId).collection(CollectionsDB.sportspace).doc(schedule.sportSpace?.sportSpaceId).collection(CollectionsDB.schedule).doc();
            await doc.create(data)
            schedule.scheduleId = doc.id;
            return schedule;
        } catch (e) {
            functions.logger.log("Error al ScheduleRepository - createSchedule :" + e);
            return Promise.reject(e);
        }
    }

    async getAllSchedulesBySportSpace(sportSpace: ESportSpace): Promise<ESchedule[]> {
        try {
            let snapshot = await getFirestore()
            .collection(CollectionsDB.company).doc(sportSpace.company!.companyId)
            .collection(CollectionsDB.sportspace).doc(sportSpace.sportSpaceId)
            .collection(CollectionsDB.schedule)
            .get();

            let schedules: ESchedule[] = [];
            if (snapshot.empty) {
                console.log('No matching documents.');
                return schedules;
            }

            snapshot.forEach((doc: any) => {
                const data = doc.data();
                schedules.push(<ESchedule>{
                    scheduleId: doc.id,
                    category:data.category,
                    days:data.days,
                    initHour:data.initHour,
                    endHour:data.endHour,
                    status: data.status,
                    created: data.created,
                });
            });

            return schedules;
        } catch (e) {
            functions.logger.log("Error al ScheduleRepository - getAllSchedulesBySportSpace :" + e);
            return Promise.reject(e);
        }
    }

}