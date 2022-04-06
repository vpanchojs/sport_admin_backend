import * as functions from "firebase-functions";
import { UserService } from "../application/service/user.service";
import { EResponse } from "../core/entities/e-reponse";
import { EUser } from "../core/entities/e-user";

export const updateUser = functions.https.onCall(async (data, context) => {
  let user: EUser;
  user = {
    userId: context.auth?.uid,
    name: data.fullName,
    birthday: new Date(data.birthday),
    gender:  data.gender.code
  }
  const response: EResponse<EUser> = await new UserService().createUser(user)
  return response
});


export const createUser = functions.https.onCall(async (data, context) => {
  functions.logger.info("controller - createUser:" + data);
  let user: EUser;
  user = {
    userId: context.auth?.uid,
    lastName: data.lastName,
    name: data.name,
    account: {
      email: data.account.email.trim(),
      password: data.account.password
    }
  }
  const response: EResponse<EUser> = await new UserService().createUser(user)
  return response
});


export const getUser = functions.https.onCall(async (data, context) => {
  functions.logger.info("controller - getUser:" + data);
  const uid = context.auth?.uid;  
  const response: EResponse<EUser> = await new UserService().getUserById(uid!);
  return response;
});

