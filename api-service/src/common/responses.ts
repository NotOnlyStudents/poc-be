const Responses = {
  success(data = {}): unknown {
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
      },
      statusCode: 200,
      body: JSON.stringify(data),
    };
  },
  userError(data = {}): unknown {
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
      },
      statusCode: 400,
      body: JSON.stringify(data),
    };
  },
};

export default Responses;
