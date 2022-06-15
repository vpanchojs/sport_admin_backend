import * as functions from "firebase-functions";
import { CError } from "../core/entities/enum/c-error";
export class Logger {
    
    error(name: string, error: unknown) : CError{        
        if(!Object.values(CError).includes(error as CError)){
            functions.logger.error(name, error+'');
            return CError.Unknown                     
        }
        return error as CError;
    }

    info(name:string, data: any):void{
        if (data instanceof Object) {
            functions.logger.info(name, JSON.stringify(data));
        }else{
            functions.logger.info(name, data);
        }        
    }
}