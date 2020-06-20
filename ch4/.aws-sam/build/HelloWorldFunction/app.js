let response;
exports.lambdaHandler = async (event, context) => {
  console.log(JSON.stringify(event, null, 2));
  try {
    response = {
      'statusCode': 200,
      'body': JSON.stringify({
        message: 'hello world',
      })
    }
  } catch (err) {
    console.log(err);
    return err;
  }
  return response;
};
