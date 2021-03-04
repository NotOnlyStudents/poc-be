import { embed } from "@aws/dynamodb-data-mapper";
import {
  attribute,
  hashKey,
  table,
} from "@aws/dynamodb-data-mapper-annotations";
import Product from "./Product";

interface CartBodyRequest {
  ID: string;
  products: Product[];
}

@table(process.env.CART_TABLE)
class Cart implements CartBodyRequest {
  @hashKey()
  ID: string;

  @attribute({ memberType: embed(Product) })
  products: Product[];

  constructor(ID = "", products: Product[] = []) {
    this.ID = ID;
    this.products = products;
  }
}

export default Cart;
