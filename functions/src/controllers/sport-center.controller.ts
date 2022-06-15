import * as functions from "firebase-functions";
import { SportSpaceService } from "../application/service/sport-space.service";
import { ECompany } from "../core/entities/e-company";
import { EResponse } from "../core/entities/e-reponse";
import { ESearchSportSpace } from "../core/entities/e-search-sportspace";
import { ESportSpace } from "../core/entities/e-sport-space";
import { EUser } from "../core/entities/e-user";
import { Logger } from "../utils/logger";

export const createSportSpace = functions.region('southamerica-east1').https.onCall(async (data, context) => {
  new Logger().info("controller - createSportSpace: ", data)
  try {

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

    const response: ESportSpace = await new SportSpaceService().createSportSpace(sportSpace);
    return response; 
  } catch (error) {
    new Logger().error("Controller - createSportSpace", error);
    throw new functions.https.HttpsError('internal', 'Problemas al crear el espacio deportivo');
  }

});


export const getAll = functions.region('southamerica-east1').https.onCall(async (data, context) => {
  functions.logger.log("controller - getAll: " + JSON.stringify(data));

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

export const getById = functions.region('southamerica-east1').https.onCall(async (data, context) => {
  functions.logger.log("controller - getById: " + JSON.stringify(data));
  let search = <ESearchSportSpace> {
    company:  <ECompany>{
      companyId : data.companyId,
      admin : <EUser>{
        userId: context.auth?.uid
      }    
    },
    sportSpace:data.sportSpace,
    status : data.status
  }
  const response: EResponse<ESportSpace> = await new SportSpaceService().getSportSpaceById(search);
  return response;
});

export const enableSportSpace = functions.region('southamerica-east1').https.onCall(async (data, context) => {
  functions.logger.info("controller - enableSportSpace: "+ JSON.stringify(data));
  
  const response: EResponse<ESportSpace> = await new SportSpaceService().enableSportSpace(data);
  return response;

});

export const disableSportSpace = functions.region('southamerica-east1').https.onCall(async (data, context) => {
  functions.logger.info("controller - disableSportSpace: "+ JSON.stringify(data));
  
  const response: EResponse<ESportSpace> = await new SportSpaceService().disableSportSpace(data);
  return response;

});
