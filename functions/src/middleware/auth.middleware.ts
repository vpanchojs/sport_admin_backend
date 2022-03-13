import * as functions from "firebase-functions";

export class AuthMiddleware {
    verififyAuth(context: functions.https.CallableContext){
        if(context.auth?.token == null){
            throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
        }
    }
}