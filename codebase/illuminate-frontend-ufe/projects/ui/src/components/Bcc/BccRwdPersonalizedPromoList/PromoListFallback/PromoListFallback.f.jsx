import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Flex, Grid, Text, Button
} from 'components/ui';
import store from 'Store';
import Actions from 'Actions';
import UiUtils from 'utils/UI';
import { CARD_WIDTH, CARD_GAP } from 'constants/promotionCard';
import { space } from 'style/config';

import LanguageLocaleUtils from 'utils/LanguageLocale';
import PageRenderReport from 'components/PageRenderReport/PageRenderReport';
import { HEADER_VALUE } from 'constants/authentication';

const { SKELETON_TEXT } = UiUtils;
const { getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Bcc/BccRwdPersonalizedPromoList/PromoListFallback/locales', 'PromoListFallback');

function PromoListFallback({ isAnonymous, isSkeleton, enablePageRenderTracking = false }) {
    return (
        <Flex
            flexDirection='column'
            justifyContent='center'
            boxShadow='light'
            borderRadius={2}
            paddingY={[4, 5]}
            paddingX={[4, 6]}
            minHeight={150}
            maxWidth={CARD_WIDTH * 2 + space[CARD_GAP[1]]}
        >
            <Text
                is='h2'
                fontWeight='bold'
                marginRight='auto'
                css={isSkeleton && SKELETON_TEXT}
                children={isAnonymous ? `${getText('signInHeading')} 👋` : `${getText('noPromosHeading')} ✨`}
            />
            <Text
                is='p'
                css={
                    isSkeleton && [
                        {
                            position: 'relative',
                            top: 8
                        },
                        SKELETON_TEXT
                    ]
                }
                children={getText(isAnonymous ? 'signInText' : 'noPromosText')}
            />
            {isAnonymous && !isSkeleton && (
                <Grid
                    marginTop={4}
                    columns={2}
                    gap={4}
                    maxWidth={366}
                >
                    <Button
                        onClick={() =>
                            store.dispatch(Actions.showSignInModal({ isOpen: true, extraParams: { headerValue: HEADER_VALUE.USER_CLICK } }))
                        }
                        variant='primary'
                        children={getText('signInButton')}
                    />
                    <Button
                        onClick={() => store.dispatch(Actions.showRegisterModal({ isOpen: true, openPostBiSignUpModal: true }))}
                        variant='secondary'
                        children={getText('registerButton')}
                    />
                </Grid>
            )}
            {enablePageRenderTracking && !isSkeleton && <PageRenderReport />}
        </Flex>
    );
}

export default wrapFunctionalComponent(PromoListFallback, 'PromoListFallback');
