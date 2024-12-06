function formatMessage(username, text) {
    return {
        username,
        text,
        time: new Date().toLocaleTimeString()
    }
}

function errorHandler(error, name, from) {
    let loggerFunction = console.log;
    loggerFunction("--------START--------");
    if (from === 'axios') {
        if (error.response) {
            loggerFunction(error.response.data);
            loggerFunction(error.response.status);
            loggerFunction(error.response.headers);
        } else if (error.request) {
            loggerFunction(error.request);
        } else {
            loggerFunction(error.message);
        }
        loggerFunction(error.toJSON());
    }
    else {
        loggerFunction(error);
    }

    loggerFunction("--------END--------");
}

module.exports = {
    formatMessage,
    errorHandler
}
