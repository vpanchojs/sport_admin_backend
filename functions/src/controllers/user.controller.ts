import * as functions from "firebase-functions";
import { UserService } from "../application/service/user.service";
import { EResponse } from "../core/entities/e-reponse";
import { EUser } from "../core/entities/e-user";
import { CError } from "../core/entities/enum/c-error";
import { UserRepository } from "../infraestructure/user/user.repository";
import { Logger } from "../utils/logger";

export const createUser = functions.region('southamerica-east1').https.onCall(async (data, context) => {
  functions.logger.info("controller - createUser:" + JSON.stringify(data));
  let user: EUser;
  user = {
    userId: context.auth?.uid,
    lastName: data.lastName,
    name: data.name,
    dni: data.dni,
    account: {
      email: data.account.email,
      password: data.account.password
    }
  }
  const response: EResponse<EUser> = await new UserService().createUser(user)
  return response
});

export const getUser = functions.region('southamerica-east1').https.onCall(async (data, context) => {
  new Logger().info("controller - getUser:", context.auth?.uid)
  try {    
    const uid = context.auth?.uid;  
    const response: EUser = await new UserService().getUserById(uid!);
    return response;
  } catch (error) {
    new Logger().error("Controller - getUser", error);
    if(error == CError.NotFound){
      throw new functions.https.HttpsError('not-found', 'No existe el usuario');
    }else{
      throw new functions.https.HttpsError('internal', 'Problemas al obtener el usuario');
    }    
  }  
});

export const getUserByDni = functions.region('southamerica-east1').https.onCall(async (data, context) => {
  functions.logger.info("controller - getUserByDni:" + JSON.stringify(data));
  const dni = data.dni;  
  const response: EResponse<EUser> = await new UserService().searchUserByDni(dni!);
  return response;
});

export const verifyEmail = functions.region('southamerica-east1').https.onRequest(async (req, res) => {
  
  const response: Boolean = await new UserRepository().verifyEmail(req.body.uid);
  res.send(response)
});

export const searchUser = functions.region('southamerica-east1').https.onCall(async (data, context) => {
  functions.logger.info("controller - searchUser:" + JSON.stringify(data));
  const uid = data;  
  const response: EResponse<EUser> = await new UserService().searchUserByDni(uid!);
  return response;
});


