exports.handler = (event, context, callback) => {
    // TODO implement
    console.log(event);
    console.log(event.triggerSource);
    event.response = {"autoConfirmUser": true};
    callback(null, event);
};
