function validateEvent(context, event) {
  const SubscriptionValidationEvent = "Microsoft.EventGrid.SubscriptionValidationEvent";

  var parsedReq = JSON.parse(event['rawBody']);

  parsedReq.forEach(eventGridEvent => {
    var eventData = eventGridEvent.data;
    if (eventGridEvent.eventType == SubscriptionValidationEvent) {
      context.res = {
        body: {
          validationResponse: eventData.validationCode
        }
      };
    }
  });

  context.done();

  return parsedReq;
}

module.exports = validateEvent;
