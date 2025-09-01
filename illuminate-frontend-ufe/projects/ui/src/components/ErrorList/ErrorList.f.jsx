import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import ErrorMsg from 'components/ErrorMsg';

function ErrorList({ errorMessages, ...props }) {
    return (
        <>
            {Array.isArray(errorMessages) && errorMessages.length
                ? errorMessages.map((errorMessage, index) => (
                    <ErrorMsg
                        {...props}
                        key={`errorMessage_${index}`}
                        children={errorMessage}
                    />
                ))
                : null}
        </>
    );
}

export default wrapFunctionalComponent(ErrorList, 'ErrorList');
