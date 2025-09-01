const merge = (reducerName, key, value) => {
    const action = {
        type: `${reducerName}_MERGE`,
        payload: {
            key,
            value
        }
    };

    return action;
};

export default {
    merge
};
