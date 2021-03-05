module.exports = {
  "extends": "airbnb-typescript-prettier",
  "rules": {
    "import/no-unresolved": [
      "error",
      {
        "ignore": [
          "aws-lambda"
        ]
      }
    ]
  },
};
