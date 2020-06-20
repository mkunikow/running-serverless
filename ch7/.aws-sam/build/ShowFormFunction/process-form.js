const htmlResponse = require('./html-response');
const aws = require('aws-sdk');
const s3 = new aws.S3();
const querystring = require('querystring')

exports.lambdaHandler = async (event, context, callback) => {
  // Read form data.
  const { name } = querystring.parse(event.body)

  console.log(`name: ${name}`)
  console.log(`context: ${context}`)
  const bucketName = process.env.UPLOAD_S3_BUCKET;
  // await s3.putObject({
  //   Bucket: bucketName,
  //   Key: context.awsRequestId,
  //   Body: JSON.stringify(event)
  // }).promise();


  const thanksHtml = `
    <html>
    <head>
      <meta charset="utf-8"/>
    </head>
    <body>
      <h1>Thanks</h1>
      <p>We received your submission</p>
      <p>Reference: ${context.awsRequestId}</p>
      </p>
    </body>
    </html>
  `;

  try {
  await s3.putObject({
    Bucket: bucketName,
    Key: context.awsRequestId,
    Body: name
  }).promise();
    return htmlResponse(thanksHtml);
  } catch (e) {
    console.log(`error:${e}`);
    return returnOnFailure('AccessDenied', 403)

  }
};

  const returnOnFailure = (errorMsg, code = 400) => ({
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(errorMsg)
  })

const returnOnError = (body) => ({
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  body: JSON.stringify(body)
})
