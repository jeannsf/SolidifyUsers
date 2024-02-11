import { IUser } from "../../models/user";
import { HttpRequest, HttpResponse } from "../potocols";
import {
  IUpdateUserController,
  IUpdateUserRepository,
  UpdateUserParams,
} from "./protocols";

export class UpdateUserController implements IUpdateUserController {
    constructor(private readonly updadteUserRepository: IUpdateUserRepository){}
  async handle(httpRequest: HttpRequest<any>): Promise<HttpResponse<IUser>> {
    try {
      const id = httpRequest?.params?.id;
      const body = httpRequest?.body;

      if (!id) {
        return {
          statusCode: 400,
          body: "Missing user idd",
        };
      }

      const allowedFieldsToUpdate: (keyof UpdateUserParams)[] = [
        "firstName",
        "lastName",
        "password",
      ];
      const someFieldIsNotAllowedToUpdate = Object.keys(body).some(
        (key) => !allowedFieldsToUpdate.includes(key as keyof UpdateUserParams)
        
        );
        
        if(someFieldIsNotAllowedToUpdate){
            return {
                statusCode: 400,
                body: "Some received field is not allowed",
            };
        }
    
        const user = await this.updadteUserRepository.updateUser(id, body)

        return {
            statusCode: 200,
            body: user,
        }
    } catch (error) {
      return {
        statusCode: 500,
        body: "Something went wrong.",
      };
    }
  }
}