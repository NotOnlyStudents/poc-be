import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { DataMapper } from "@aws/dynamodb-data-mapper";

import Cart from "../types/Cart";
import Product from "../types/Product";
import Responses from "../common/responses";
import DynamoDB from "../common/dynamodb";

const mapper = new DataMapper({ client: DynamoDB });

const handler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!event.body || !(JSON.parse(event.body) as Cart)) {
    return Responses.userError({ message: `Missing body from request.` });
  }

  const parsedBody: Cart = await JSON.parse(event.body);
  const products = parsedBody.products.map((item: Product) => {
    return new Product(
      item.ID,
      item.name,
      item.description,
      item.price,
      item.quantity
    );
  });

  const cart = new Cart(parsedBody.ID, products);

  try {
    await mapper.put(cart);

    return Responses.success({ cart });
  } catch (error) {
    console.error("Error putting data on DynamoDB", error);
    return Responses.userError({
      message: `Failed to put cart with id: ${cart.ID}`,
    });
  }
};
export default handler;
