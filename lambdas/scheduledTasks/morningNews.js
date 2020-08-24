const AWS = require('aws-sdk');
const Responses = require('../common/API_Responses');
const Axios = require('axios');

const SES = new AWS.SES();

const URL = 'https://newsapi.org';

exports.handler = async event => {
    console.log('event', event);

    const techNews = await getNews()

    const emailHTML = createEmailHTML(techNews)

    const params = {
        Destination: {
            ToAddresses: ['nosvalds@gmail.com']
        },
        Message: {
            Body: {
                Html: {
                    Data: emailHTML
                }
            },
            Subject: { Data: 'Morning Tech News'}
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

const createEmailHTML = techNews => {
    return `<html>
    <body>
        <h1>Top Tech News</h1>
        ${techNews.map(article => {
            return `
            <h3>${article.title}</h3>
            <p>${article.description}</p>
            <a href=${article.url}><button>Read More</button></a>
            `
        })}
    </body>
</html>`
};

const getNews = async () => {
    const options = {
        params: {
            country: 'gb',
            category: 'technology'
        },
        headers: {
            'X-API-KEY': '01106456f8d447a5b05cda43a9839178'
        }
    }

    const { data: newsData } = await Axios.get(`${URL}/v2/top-headlines`, options)

    if (!newsData) {
        throw Error('no data from news api')
    }

    return newsData.articles.slice(0,5);
};