import * as functions from "firebase-functions";
import { SportSpaceService } from "../application/service/sport-space.service";
import { ECompany } from "../core/entities/e-company";
import { EResponse } from "../core/entities/e-reponse";
import { ESearchSportSpace } from "../core/entities/e-search-sportspace";
import { ESportSpace } from "../core/entities/e-sport-space";
import { EUser } from "../core/entities/e-user";

export const createSportSpace = functions.https.onCall(async (data, context) => {
  functions.logger.info("controller - createSportSpace: "+data);
  
  let sportSpace: ESportSpace;
  
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


export const getAll = functions.https.onCall(async (data, context) => {
  functions.logger.log("controller - getAll: " + data.status);

  let search = <ESearchSportSpace> {
    company:  <ECompany>{
      companyId : data.companyId,
      admin : <EUser>{
        userId: context.auth?.uid
      }    
    },
    status : data.status
  }
  const response: EResponse<ESportSpace[]> = await new SportSpaceService().getAllSportSpacesByCompany(search);
  return response;
});

export const enableSportSpace = functions.https.onCall(async (data, context) => {
  functions.logger.info("controller - enableSportSpace: "+data);
  
  const response: EResponse<ESportSpace> = await new SportSpaceService().enableSportSpace(data);
  return response;

});

export const disableSportSpace = functions.https.onCall(async (data, context) => {
  functions.logger.info("controller - disableSportSpace: "+data);
  
  const response: EResponse<ESportSpace> = await new SportSpaceService().disableSportSpace(data);
  return response;

});
