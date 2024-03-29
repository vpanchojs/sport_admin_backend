import * as functions from "firebase-functions";
import { UserService } from "../application/service/user.service";
import { EUser } from "../core/entities/e-user";
import { CError } from "../core/entities/enum/c-error";
import { CUserStatus } from "../core/entities/enum/c-user-state";
import { UserRepository } from "../infraestructure/user/user.repository";
import { Logger } from "../utils/logger";

export const createUser = functions.region('southamerica-east1').https.onCall(async (data, context) => {
  new Logger().info("controller - createUser:", data);
  try {
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
    const response: EUser = await new UserService().createUser(user)
    return response
  } catch (error) {
    new Logger().error("Controller - createUser", error);
    if (error == CError.NotFound) {
      throw new functions.https.HttpsError('not-found', 'No existe usuario');
    } else {
      if (error == CError.BadRequest) {
        throw new functions.https.HttpsError('invalid-argument', 'Los datos enviados no son correcto');
      } else {
        if (error == CError.AlreadyExists) {
          throw new functions.https.HttpsError('already-exists', 'La identificación/email se ecuentra registrada en una cuenta');          
        } else {
          if(error == CError.FailedPrecondition){
            throw new functions.https.HttpsError('failed-precondition', 'El usuario esta inactivo o en proceso de eliminación');
          }else{
            throw new functions.https.HttpsError('internal', 'Problemas al crear cliente');
          }          
        }         
      }            
    }    
  }
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

export const verifyEmail = functions.region('southamerica-east1').https.onRequest(async (req, res) => {
  
  const response: Boolean = await new UserRepository().verifyEmail(req.body.uid);
  res.send(response)
});

export const searchUser = functions.region('southamerica-east1').https.onCall(async (data, context) => {
  new Logger().info("controller - searchUser:", data)
  try {
    const uid = data;  
    const response: EUser = await new UserService().searchUserByDni(uid!);
    return response;    
  } catch (error) {
    new Logger().error("Controller - crearCompany", error);
    if (error == CError.NotFound) {
      throw new functions.https.HttpsError('not-found', 'No existe usuario');
    } else {
      if(error == CError.FailedPrecondition){
        throw new functions.https.HttpsError('failed-precondition', 'El usuario esta en proceso de eliminación y no se puede hacer uso de la información');
      }else{
        throw new functions.https.HttpsError('internal', 'Problemas al crear cliente');
      }       
    }
  }
});

export const deleteAccount = functions.region('southamerica-east1').https.onCall(async (data, context) => {
  new Logger().info("controller - deleteAccount:", data)
  try {
    //const uid = data;  
    let user: EUser;
    user = {
      userId: data,
      status: CUserStatus.ELIMINADO
    }
    const response: boolean = await new UserService().deleteAccount(user!);
    return response;    
  } catch (error) {
    new Logger().error("Controller - deleteAccount", error);
    if (error == CError.NotFound) {
      throw new functions.https.HttpsError('not-found', 'No existe usuario');
    } else {
      throw new functions.https.HttpsError('internal', 'Problemas al obtener usuario');
    }    
  }
});


