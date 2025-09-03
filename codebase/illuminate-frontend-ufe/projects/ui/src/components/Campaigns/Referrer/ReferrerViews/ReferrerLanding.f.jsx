/* eslint-disable object-curly-newline */
import React from 'react';
import { Box, Text, Divider, Button } from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import languageLocaleUtils from 'utils/LanguageLocale';
import anaConsts from 'analytics/constants';
import { wrapFunctionalComponent } from 'utils/framework';
import { space } from 'style/config';
import store from 'store/Store';
import Actions from 'Actions';
import userUtils from 'utils/User';
import Barcode417 from 'components/Barcode/Barcode417';
import { HEADER_VALUE } from 'constants/authentication';

const { getLocaleResourceFile } = languageLocaleUtils;
const getText = getLocaleResourceFile('components/Campaigns/Referrer/locales', 'Referrer');

function renderSignIn({ block = Sephora.isMobile(), actionParams }) {
    return (
        <Button
            variant='primary'
            hasMinWidth={!block}
            block={block}
            onClick={() =>
                store.dispatch(
                    Actions.showSignInModal({ ...actionParams, extraParams: { ...actionParams.extraParams, headerValue: HEADER_VALUE.USER_CLICK } })
                )
            }
            data-at={Sephora.debug.dataAt('sign_in_btn')}
            children={getText('signIn')}
        />
    );
}

function renderJoinBI({ block = Sephora.isMobile(), actionParams }) {
    return (
        <Button
            variant='primary'
            hasMinWidth={!block}
            block={block}
            onClick={() => store.dispatch(Actions.showBiRegisterModal(actionParams))}
            data-at={Sephora.debug.dataAt('join_now_btn')}
            children={getText('joinNow')}
        />
    );
}

function renderRegister({ variant = 'primary', block = Sephora.isMobile(), actionParams }) {
    return (
        <Button
            variant={variant}
            hasMinWidth={!block}
            block={block}
            onClick={() => store.dispatch(Actions.showRegisterModal(actionParams))}
            data-at={Sephora.debug.dataAt('create_account_btn')}
            children={getText('createAccount')}
        />
    );
}

function getInstructions(instructions) {
    const keys = Object.keys(instructions);

    if (!keys) {
        return null;
    }

    return keys.map((key, i) => {
        if (key.indexOf('instruction') === -1 || !instructions[key]) {
            return null;
        }

        return (
            <li
                key={`instruction${i}`}
                children={instructions[key]}
            />
        );
    });
}

function getActionButton({ referral, isBI, isBiSignUp, isFnF }) {
    const actionParams = {
        isOpen: true,
        extraParams: { referral }
    };

    if (!userUtils.isAnonymous()) {
        if (!isBI) {
            return renderJoinBI({ actionParams });
        }
    } else {
        if (isBiSignUp) {
            return renderRegister({
                variant: 'primary',
                actionParams
            });
        } else if (isFnF) {
            const isDesktop = Sephora.isDesktop();

            return (
                <LegacyGrid
                    gutter={4}
                    fill={isDesktop}
                >
                    <LegacyGrid.Cell>
                        {renderSignIn({
                            block: true,
                            actionParams
                        })}
                    </LegacyGrid.Cell>
                    <LegacyGrid.Cell marginTop={isDesktop || 4}>
                        {renderRegister({
                            variant: 'secondary',
                            block: true,
                            actionParams
                        })}
                    </LegacyGrid.Cell>
                </LegacyGrid>
            );
        }
    }

    return null;
}

function ReferrerLanding({
    isBI,
    isLoggedIn,
    campaignType,
    offerDescription,
    instructions = {},
    referrerFirstName,
    referrerText,
    offerDisclaimer,
    referral,
    isBiSignUp,
    isFnF,
    barCodeText,
    instoreSignUp
}) {
    const isDesktop = Sephora.isDesktop();
    digitalData.page.pageInfo.pageName = anaConsts.PAGE_NAMES.ADV_CAMPAIGNS;
    digitalData.page.category.pageType = anaConsts.PAGE_TYPES.ADV_REFERRER;

    return (
        <Box
            maxWidth={774}
            marginX='auto'
            marginTop={isDesktop ? 6 : 5}
            lineHeight='tight'
        >
            <LegacyGrid
                fill={isDesktop}
                gutter={5}
            >
                <LegacyGrid.Cell
                    display='flex'
                    flexDirection={isDesktop ? 'column' : 'column-reverse'}
                >
                    <Text
                        is='h1'
                        fontWeight='bold'
                        fontSize='3xl'
                        marginBottom={5}
                        data-at={Sephora.debug.dataAt('offer_description')}
                        children={offerDescription}
                    />
                    <Text
                        is='p'
                        marginBottom={5}
                        data-at={Sephora.debug.dataAt('referrer_text')}
                        children={`${referrerText} ${referrerFirstName}`}
                    />
                </LegacyGrid.Cell>
                <LegacyGrid.Cell>
                    <div data-at={Sephora.debug.dataAt('instruction')}>
                        <Text
                            is='h2'
                            marginTop={isDesktop && 2}
                            marginBottom={2}
                            fontWeight='bold'
                            data-at={Sephora.debug.dataAt('instruction_title')}
                            children={instructions.headline}
                        />
                        <Box
                            is='ol'
                            marginLeft='1.25em'
                            marginBottom={5}
                            css={{
                                listStyle: 'decimal',
                                '& li + li': {
                                    marginTop: space[2]
                                }
                            }}
                        >
                            {getInstructions(instructions)}
                        </Box>
                    </div>
                    {getActionButton({
                        campaignType,
                        isBI,
                        isLoggedIn,
                        referral,
                        isBiSignUp,
                        isFnF
                    })}
                    {barCodeText && (
                        <React.Fragment>
                            <Text
                                is='p'
                                marginTop={5}
                                marginBottom={3}
                                textAlign={['center', 'left']}
                                children={instoreSignUp}
                            />
                            <Barcode417
                                code={barCodeText}
                                border={1}
                            />
                        </React.Fragment>
                    )}
                </LegacyGrid.Cell>
            </LegacyGrid>
            <Divider
                marginTop={5}
                marginBottom={4}
            />
            <Text
                is='p'
                fontSize='sm'
                lineHeight='tight'
                color='gray'
                data-at={Sephora.debug.dataAt('offer_disclaimer')}
                children={offerDisclaimer}
            />
        </Box>
    );
}

export default wrapFunctionalComponent(ReferrerLanding, 'ReferrerLanding');
