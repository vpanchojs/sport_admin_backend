import * as functions from "firebase-functions";
import { UserService } from "../application/service/user.service";
import { EResponse } from "../core/entities/e-reponse";
import { EUser } from "../core/entities/e-user";
import { UserRepository } from "../infraestructure/user/user.repository";

export const createUser = functions.region('southamerica-east1').https.onCall(async (data, context) => {
  functions.logger.info("controller - createUser:" + JSON.stringify(data));
  let user: EUser;
  user = {
    userId: context.auth?.uid,
    lastName: data.lastName,
    name: data.name,
    account: {
      email: data.account.email,
      password: data.account.password
    }
  }
  const response: EResponse<EUser> = await new UserService().createUser(user)
  return response
});


export const getUser = functions.region('southamerica-east1').https.onCall(async (data, context) => {
  functions.logger.info("controller - getUser:" + JSON.stringify(data));
  const uid = context.auth?.uid;  
  const response: EResponse<EUser> = await new UserService().getUserById(uid!);
  return response;
});

export const verifyEmail = functions.region('southamerica-east1').https.onRequest(async (req, res) => {
  
  const response: Boolean = await new UserRepository().verifyEmail(req.body.uid);
  res.send(response)
});


