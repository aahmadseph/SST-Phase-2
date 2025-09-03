import {
    resolve,
    basename
} from 'path';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';
const filename = basename(resolve(import.meta.url));
import {
    safelyParse
} from '#server/utils/serverUtils.mjs';
import {
    sendAPIJsonResponse,
    sendAPI401Response,
    sendAPI403Response
} from '#server/utils/sendAPIResponse.mjs';
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);
import getShippingAddresses from '#server/services/api/profile/getShippingAddresses.mjs';
import getCreditCardsFromProfile from '#server/services/api/profile/getCreditCardsFromProfile.mjs';
import {
    getDataFromObject,
    isError,
    getOptions,
    formatShippingAddress,
    formatPayment
} from '#server/services/apiOrchestration/userFull/utils/utils.mjs';
import {
    ERROR_FIELDS
} from '#server/services/apiOrchestration/userFull/utils/constants.mjs';

function getShippingAndCreditCards(request, response) {
    const addressRequired = Boolean(request.apiOptions.parseQuery?.shippingAddressId);
    const apisToCall = [
        getCreditCardsFromProfile
    ];

    if (addressRequired){
        apisToCall.push(getShippingAddresses);
    }

    const options = getOptions(request.apiOptions, request.headers);
    const dependentApiCalls = apisToCall.map(x => x(options));

    const logsData = {
        'url': request.url,
        'statusCode': response.statusCode,
        'headers': Object.keys(options)
    };
    logger.info(stringifyMsg(logsData));

    Promise.allSettled(dependentApiCalls).then(results => {
        const [
            creditCards,
            shippingAdresses = {}
        ] = results;

        const shippingAdressesParsed = safelyParse(shippingAdresses?.value?.data, false) || shippingAdresses;
        const creditCardsParsed = safelyParse(creditCards?.value?.data, false) || creditCards;
        const isShippingAddressRejected = isError(shippingAdresses, shippingAdressesParsed);
        const isCreditCardsRejected = isError(creditCards, creditCardsParsed);
        results.forEach(res => {
            if (res.status !== 'fulfilled' || res.value.data.errorCode) {
                logger.error(stringifyMsg(res.reason));
            }
        });

        const shippingAddress = !isShippingAddressRejected && shippingAdressesParsed?.address?.length
            ? shippingAdressesParsed.address[0]
            : {};

        const statusCodes = [shippingAdresses?.reason?.statusCode, creditCards?.reason?.statusCode];

        if (statusCodes.includes(401)) {
            return sendAPI401Response(response, true);
        } else if (statusCodes.includes(403)) {
            return sendAPI403Response(response, true);
        }

        let responseToUFE;
        const errors = [];

        if (addressRequired) {
            if (isShippingAddressRejected) {
                responseToUFE = {
                    ...responseToUFE,
                    errorCode: shippingAdresses?.reason?.statusCode
                };
                errors.push(getDataFromObject(ERROR_FIELDS, shippingAdresses?.reason || { err: shippingAdressesParsed?.errorMessages }));
            } else {
                const shippingAddressFormated = formatShippingAddress(shippingAddress);
                responseToUFE = {
                    shippingAddress: shippingAddressFormated
                };
            }
        }

        if (!isCreditCardsRejected) {
            const paymentFormated = formatPayment(creditCardsParsed);
            responseToUFE = {
                ...responseToUFE,
                payment: paymentFormated
            };
        } else {
            responseToUFE = {
                ...responseToUFE,
                errorCode: creditCards?.reason?.statusCode
            };
            errors.push(getDataFromObject(ERROR_FIELDS, creditCards.reason));
        }

        if (errors.length) {
            responseToUFE = {
                ...responseToUFE,
                errors
            };
        }

        return sendAPIJsonResponse(response, responseToUFE);

    }).catch(e => sendAPIJsonResponse(response, {}, e));
}

export default getShippingAndCreditCards;
