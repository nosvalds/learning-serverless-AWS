const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');

// use env variable for possibility of future changes
const tableName = process.env.tableName;

exports.handler = async event => {
    console.log('event', event)

    if (!event.pathParameters || !event.pathParameters.ID) {
        // failed without an ID
        return Responses._400({message: 'missing the ID from the path'})
    }

    let ID = event.pathParameters.ID;

    // Get data from the request
    const user = JSON.parse(event.body);
    user.ID = ID;

    // write to DB
    const newUser = await Dynamo.write(user, tableName).catch(err => {
        console.log('error in dynamoDB write', err);
        return null;
    })

    if (!user) {
        return Responses._400({message: 'Failed to write user by ID'})
    }

    return Responses._200({ newUser })
}