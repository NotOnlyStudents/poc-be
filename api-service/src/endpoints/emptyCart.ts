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
  if (!event.pathParameters || !event.pathParameters.CART_ID) {
    return Responses.userError({ message: "Missing the ID from the path" });
  }

  const ID = event.pathParameters.CART_ID;
  const cart: Cart = new Cart(ID);

  try {
    await mapper.update(cart, { onMissing: "skip" });

    return Responses.success({ cart });
  } catch (err) {
    console.error("Error updating data on DynamoDB", err);
    return Responses.userError({
      message: `Failed to empty the cart with ID: ${ID}`,
    });
  }
};
export default handler;
