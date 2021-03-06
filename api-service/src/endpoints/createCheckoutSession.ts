import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import axios from "axios";
import Stripe from "stripe";

import Responses from "../common/responses";
import Cart from "../types/Cart";
import Product from "../types/Product";

let baseUrl: string;
let clientBaseUrl: string;
if (process.env.IS_OFFLINE) {
  baseUrl = "http://localhost:3000";
  clientBaseUrl = "http://localhost:8080";
} else {
  baseUrl = "https://api.annoiato.net";
  clientBaseUrl = "https://shop.annoiato.net";
}

const getCart = async (cartID: string): Promise<Cart> => {
  const resp = await axios.get<{ Cart }>(`${baseUrl}/dev/cart/${cartID}`);
  return resp.data.cart;
};

const handler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event);
  if (!event.pathParameters || !event.pathParameters.CART_ID) {
    return Responses.userError({ message: `Missing the ID from the path` });
  }

  const ID = event.pathParameters.CART_ID;

  try {
    const cart = await getCart(ID);

    const cartItems = cart.products.map((item: Product) => {
      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            description: item.description,
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      };
    });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2020-08-27",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cartItems,
      mode: "payment",
      // TODO: redirect to backend
      success_url: `${clientBaseUrl}/purchased`,
      cancel_url: `${clientBaseUrl}/`,
    });

    return Responses.success({ id: session.id });
  } catch (error) {
    console.error(`Error while getting the ${ID} cart - ${error}`);
    return Responses.userError({
      message: `Error while getting the ${ID} cart.`,
    });
  }
};
export default handler;
