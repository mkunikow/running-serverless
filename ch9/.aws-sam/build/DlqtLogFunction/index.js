exports.handler = async (event, context) => {
  console.log(`dlq event: ${JSON.stringify(event)}`)
};