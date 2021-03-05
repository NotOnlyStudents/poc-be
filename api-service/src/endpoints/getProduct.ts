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
  if (!event.pathParameters || !event.pathParameters.ID) {
    return Responses.userError({ message: "Missing the ID from the path" });
  }

  const { ID } = event.pathParameters;
  const toFetchProduct = new Product(ID);

  try {
    const product: Product = await mapper.get(toFetchProduct);

    return Responses.success({ product });
  } catch (error) {
    console.log("Error fetching data from DynamoDB", error);
    return Responses.userError({
      message: `Failed to get product by ID: ${ID}`,
    });
  }
};
export default handler;
