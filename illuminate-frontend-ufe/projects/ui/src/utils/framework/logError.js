import { isUfeEnvProduction } from 'utils/Env';
import printTimestamp from 'utils/Timestamp';

const logError = (error = {}, additionalInformation = { source: 'Unknown' }) => {
    const { isNodeRender, pagePath: path, renderQueryParams: queryParams, serverErrors } = Sephora;
    const { message = '', name = '', stack = '' } = error;

    if (isNodeRender) {
        if (!isUfeEnvProduction && serverErrors) {
            serverErrors.push({
                message,
                name,
                path,
                queryParams,
                stack,
                ...additionalInformation
            });
        }
    }

    const timestamp = printTimestamp();
    const logEntry = `${timestamp} - [${additionalInformation.source}] ${stack}`;
    // eslint-disable-next-line no-console
    console.error(logEntry);
};

export default logError;
