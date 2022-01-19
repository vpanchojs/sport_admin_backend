import * as functions from "firebase-functions";
import { SportSpaceService } from "../application/service/sport-space.service";
import { ECompany } from "../core/entities/e-company";
import { EResponse } from "../core/entities/e-reponse";
import { ESchedule } from "../core/entities/e-schedule";
import { ESportSpace } from "../core/entities/e-sport-space";
import { EUser } from "../core/entities/e-user";

export const createSportSpace = functions.https.onCall(async (data, context) => {
  let sportSpace: ESportSpace;
  console.log('data', data);
  sportSpace = {
    name: data.name,
    description: data.description,
    maxPlayersTeam: data.maxPlayersTeam,
    maxTeams: data.maxTeams,
    material: data.material,
    sportType: data.sportType,
    company: <ECompany>{
      companyId: data.company.companyId
    }
  }

  const response: EResponse<ESportSpace> = await new SportSpaceService().createSportSpace(sportSpace);
  return response;

});


export const createSchedule = functions.https.onCall(async (data, context) => {
  let schedule: ESchedule;
  console.log('data', data);
  schedule = {
    category: data.category,
    days: data.days,
    initHour: data.initHour,
    endHour: data.endHour,
    sportSpace: data.sportSpace,
    prices: data.prices
  }

  const response: EResponse<ESchedule> = await new SportSpaceService().createSchedule(schedule);
  return response;

});

export const getAll = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  functions.logger.log("Data uid:" + uid);

  let company = <ECompany>{
    companyId : data.companyId,
    admin : <EUser>{
      userId: context.auth?.uid
    }    
  }

  const response: EResponse<ESportSpace[]> = await new SportSpaceService().getAllSportSpacesByCompany(company);
  return response;
});