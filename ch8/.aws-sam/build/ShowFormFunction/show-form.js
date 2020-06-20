const htmlResponse = require('./html-response');
const buildForm = require('./build-form');
const aws = require('aws-sdk');
const s3 = new aws.S3();
const uploadLimitInMB = parseInt(process.env.UPLOAD_LIMIT_IN_MB);
exports.lambdaHandler = async (event, context) => {
  const apiHost = event.requestContext.domainName,
    prefix = event.requestContext.stage,
    redirectUrl = `https://${apiHost}/${prefix}/confirm`,
    params = {
      Bucket: process.env.UPLOAD_S3_BUCKET,
      Expires: 6,
      Conditions: [
        ['content-length-range', 1, uploadLimitInMB * 1000000],
      ],
      Fields: {
        success_action_redirect: redirectUrl,
        acl: 'private',
        key: context.awsRequestId + '.jpg'
      }
    },
    form = s3.createPresignedPost(params);
  return htmlResponse(buildForm(form));
};
