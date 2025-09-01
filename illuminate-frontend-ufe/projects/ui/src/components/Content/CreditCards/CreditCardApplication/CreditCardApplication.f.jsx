/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import PleaseSignIn from 'components/RichProfile/MyAccount/PleaseSignIn';
import { Box } from 'components/ui';
import CreditCardApplyForm from 'components/Content/CreditCards/CreditCardApplyForm';
import ufeApi from 'services/api/ufeApi';

const { getCallsCounter } = ufeApi;

const CreditCardApplication = ({ content = {}, isAnonymous, isBiAccountInfoReady }) => (
    <>
        {isAnonymous || !isBiAccountInfoReady ? (
            <Box marginX={[4, 4, 0]}>
                <PleaseSignIn />
            </Box>
        ) : (
            <Box>
                <CreditCardApplyForm
                    nonPreApprovedContent={content.nonPaContentZoneCollection?.nonPaContentZone[0]}
                    privateLabelContent={content.plccContentZoneCollection?.plccContentZone[0]}
                    coBrandedLabelContent={content.cbccContentZoneCollection?.cbccContentZone[0]}
                    postAppContent={content.postAppContentCollection?.postAppContent[0]}
                    requestCounter={getCallsCounter()}
                />
            </Box>
        )}
    </>
);

export default wrapFunctionalComponent(CreditCardApplication, 'CreditCardApplication');
