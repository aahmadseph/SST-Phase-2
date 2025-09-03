import { createSelector } from 'reselect';
import ErrorConstantsUtils from 'utils/ErrorConstants';
import errorsSelector from 'selectors/errors/errorsSelector';

const {
    ERROR_LEVEL: { GLOBAL }
} = ErrorConstantsUtils;
const globalErrorsSelector = createSelector(errorsSelector, errors => errors[GLOBAL]);

export { globalErrorsSelector };
