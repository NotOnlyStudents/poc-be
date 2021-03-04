module.exports = {
    tables: [{
        TableName: "products-table",
        KeySchema: [{
            AttributeName: "ID",
            KeyType: "HASH"
        }],
        AttributeDefinitions: [{
            AttributeName: "ID",
            AttributeType: "S"
        }],
        BillingMode: 'PY_PER_REQUEST'
    }]
}