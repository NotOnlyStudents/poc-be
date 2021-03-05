import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
  Context,
  Callback
} from "aws-lambda";
import { DataMapper } from "@aws/dynamodb-data-mapper";

import Product from "../types/Product";
import Responses from "../common/responses";
import DynamoDB from "../common/dynamodb";

const postProduct = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!event.body || !(JSON.parse(event.body) as Product)) {
    return Responses.userError({ message: `Missing body from request.` }) as APIGatewayProxyResult;
  }

  const mapper = new DataMapper({ client: DynamoDB });

  const parsedBody: Product = JSON.parse(event.body);
  const product = new Product(
    parsedBody.ID,
    parsedBody.name,
    parsedBody.description,
    parsedBody.price,
    parsedBody.quantity
  );

  try {
    await mapper.put(product);

    return Responses.success({ product }) as APIGatewayProxyResult;
  } catch (error) {
    console.error("Error putting data on DynamoDB", error);
    return Responses.userError({
      message: `Failed to put product: ${product}`,
    }) as APIGatewayProxyResult;
  }
};

const handler: Handler = async (
  event: APIGatewayProxyEvent,
  _context: Context,
  callback: Callback
) => {
  try {
    console.log(event);
    callback(null, await postProduct(event));
  } catch (error) {
    callback(error);
  }
};

export { handler, postProduct };
