import { DynamoDB } from "aws-sdk";

let options = {};
if (process.env.IS_OFFLINE) {
  options = {
    region: "localhost",
    endpoint: "http://localhost:8000",
  };
}

if (process.env.JEST_WORKER_ID) {
  options = {
    region: "local-env",
    endpoint: "http://localhost:8000",
    sslEnabled: false,
  };
}

export default new DynamoDB(options);
