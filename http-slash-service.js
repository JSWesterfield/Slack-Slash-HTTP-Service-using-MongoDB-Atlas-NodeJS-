//Example Function for Slack HTTP Service in Stitch
exports = async function (payload) {
    const mongodb = context.services.get("mongodb-atlas");
    const exampledb = mongodb.db("exampledb");
    const examplecoll = exampledb.collection("examplecoll");

    const args = payload.query.text.split(" ");

    switch (args[0]) {
        case "stash":
            const result = await examplecoll.insertOne({
                user_id: payload.query.user_id,
                when: Date.now(),
                url: args[1]
            });
            if (result) {
                return {
                    text: `Stashed ${args[1]}`
                };
            }
            return {
                text: `Error stashing`
            };
        case "list":
            const findresult = await examplecoll.find({}).toArray();
            const strres = findresult.map(x => `<${x.url}|${x.url}>  by <@${x.user_id}> at ${new Date(x.when).toLocaleString()}`).join("\n");
            return {
                text: `Stash as of ${new Date().toLocaleString()}\n${strres}`
            };
        case "remove":
            const delresult = await examplecoll.deleteOne({
                user_id: {
                    $eq: payload.query.user_id
                },
                url: {
                    $eq: args[1]
                }
            });
            return {
                text: `Deleted ${delresult.deletedCount} stashed items`
            };
        default:
            return {
                text: "Unrecognized"
            };
    }
}

// This function is the webhook's request handler.
//exports = function(payload, response) {
    // Data can be extracted from the request as follows:

    // Query params, e.g. '?arg1=hello&arg2=world' => {arg1: "hello", arg2: "world"}
    //const {arg1, arg2} = payload.query;

    // Headers, e.g. {"Content-Type": ["application/json"]}
    //const contentTypes = payload.headers["Content-Type"];

    // Raw request body (if the client sent one).
    // This is a binary object that can be accessed as a string using .text()
    //const body = payload.body;

    //console.log("arg1, arg2: ", arg1, arg2);
    //console.log("Content-Type:", JSON.stringify(contentTypes));
    //console.log("Request body:", body);

    // You can use 'context' to interact with other Stitch features.
    // Accessing a value:
    // var x = context.values.get("value_name");

    // Querying a mongodb service:
    // const doc = context.services.get("mongodb-atlas").db("dbname").collection("coll_name").findOne();

    // Calling a function:
    // const result = context.functions.execute("function_name", arg1, arg2);

    // The return value of the function is sent as the response back to the client
    // when the "Respond with Result" setting is set.
    //return  "Hello World!";
//};