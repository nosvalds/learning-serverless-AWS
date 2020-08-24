const AWS = require('aws-sdk');
const Responses = require('../common/API_Responses')

const SES = new AWS.SES();

exports.handler = async event => {
    console.log('event', event);

    const message = `Yo bro`;

    const params = {
        Destination: {
            ToAddresses: ['nosvalds@gmail.com']
        },
        Message: {
            Body: {
                Text: {
                    Data: message
                }
            },
            Subject: { Data: 'reminder email'}
        },
        Source: 'nosvalds@gmail.com',
    }

    try {
        await SES.sendEmail(params).promise();
        return Responses._200({message: 'email sent'})
    } catch (error) {
        console.log('error', error);
        return Responses._400({message: 'failed to send email'})
    }
}