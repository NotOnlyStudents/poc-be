import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { DataMapper } from "@aws/dynamodb-data-mapper";

import Product from "../types/Product";
import Responses from "../common/responses";
import DynamoDB from "../common/dynamodb";

const mapper = new DataMapper({ client: DynamoDB });

const handler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event);
  if (!event.body || !(JSON.parse(event.body) as Product)) {
    return Responses.userError({ message: `Missing body from request.` });
  }

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

    return Responses.success({ product });
  } catch (error) {
    console.error("Error putting data on DynamoDB", error);
    return Responses.userError({
      message: `Failed to put product: ${product}`,
    });
  }
};
export default handler;
