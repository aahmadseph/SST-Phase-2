const loggerMiddleware = storeAPI => next => action => {
    const startTime = performance.now();
    const prevState = storeAPI.getState();
    const returnedValue = next(action);
    const nextState = storeAPI.getState();
    const endTime = performance.now();
    const executionTime = endTime - startTime;

    Sephora.logger.info(`${endTime} [ReduxAction] ${action.type}:`, {
        prevState,
        action,
        nextState,
        executionTime
    });

    return returnedValue;
};

export default loggerMiddleware;
