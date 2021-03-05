import {
  attribute,
  hashKey,
  table,
} from "@aws/dynamodb-data-mapper-annotations";

interface ProductBodyRequest {
  ID: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

@table("products-table")
class Product implements ProductBodyRequest {
  @hashKey()
  ID: string;

  @attribute()
  name: string;

  @attribute()
  description: string;

  @attribute()
  price: number;

  @attribute()
  quantity: number;

  constructor(ID = "", name = "", description = "", price = 0.0, quantity = 1) {
    this.ID = ID;
    this.name = name;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
  }
}

export default Product;
