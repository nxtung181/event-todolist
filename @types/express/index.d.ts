/* eslint-disable @typescript-eslint/ban-types */
import { IUserRes } from "@common/user/user.interface";


declare global {
    namespace Express {
        interface Response {
            sendJson(data: unknown): this;
        }
    }
}
declare global {
    namespace Express {
      interface Request {
        user: IUserRes;
      }
    }
  }

export {};
