import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { DataMapper } from "@aws/dynamodb-data-mapper";

import Cart from "../types/Cart";
import Responses from "../common/responses";
import DynamoDB from "../common/dynamodb";

const mapper = new DataMapper({ client: DynamoDB });

const handler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event);
  if (!event.pathParameters || !event.pathParameters.ID) {
    return Responses.userError({ message: "Missing the ID from the path" });
  }

  const { ID } = event.pathParameters;
  const toFetchCart: Cart = new Cart(ID);

  try {
    const cart: Cart = await mapper.get(toFetchCart);

    return Responses.success({ cart });
  } catch (error) {
    console.log("Error fetching data from DynamoDB", error);
    return Responses.userError({ message: `Failed to get cart by ID: ${ID}` });
  }
};
export default handler;
