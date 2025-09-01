/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'store/Store';
import auth from 'utils/Authentication';
import Actions from 'Actions';
import userUtils from 'utils/User';
import watch from 'redux-watch';
import anaConsts from 'analytics/constants';

import { Text, Link } from 'components/ui';
import skuUtils from 'utils/Sku';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { Pages } from 'constants/Pages';
import skuHelpers from 'utils/skuHelpers';
import { HEADER_VALUE } from 'constants/authentication';

const { getLocaleResourceFile } = LanguageLocaleUtils;

const { showBiRegisterModal } = Actions;

class ProductQuickLookMessage extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isUserAnonymous: true,
            isUserSignedIn: false,
            isUserBI: false,
            isUserRecognized: false,
            isBiLevelQualifiedFor: false,
            loginStatus: null
        };
    }
    componentDidMount() {
        this.setStateForUser(store.getState().user);

        const w = watch(store.getState, 'auth');

        store.subscribe(
            w(newVal => {
                this.setStateForUser(newVal);
            }),
            this
        );
    }

    setStateForUser = newVal => {
        this.setState({
            isUserAnonymous: userUtils.isAnonymous(),
            isUserSignedIn: userUtils.isSignedIn(),
            isUserBI: userUtils.isBI(),
            isUserRecognized: userUtils.isRecognized(),
            profileStatus: newVal.profileStatus
        });
    };

    signInHandler = () => {
        auth.requireAuthentication(false, null, null, null, false, HEADER_VALUE.USER_CLICK).catch(() => {});
    };

    biRegisterHandler = () => {
        // sign up for beauty insider modal needs to be implemented
        store.dispatch(
            showBiRegisterModal({
                isOpen: true,
                analyticsData: {
                    context: anaConsts.PAGE_TYPES.QUICK_LOOK,
                    nextPageContext: anaConsts.PAGE_TYPES.QUICK_LOOK
                }
            })
        );
    };

    render() {
        const { currentSku } = this.props;

        const getText = getLocaleResourceFile(
            'components/GlobalModals/QuickLookModal/ProductQuickLookModal/ProductQuickLookMessage/locales',
            'ProductQuickLookMessage'
        );

        let userLabel;

        if (skuUtils.isBiExclusive(currentSku) && !skuHelpers.isBiQualify(currentSku)) {
            if (currentSku.biExclusiveLevel === 'BI') {
                userLabel = getText('beautyInsider');
            } else if (currentSku.biExclusiveLevel === 'Rouge') {
                userLabel = getText('rouge');
            } else if (currentSku.biExclusiveLevel === 'VIB') {
                userLabel = getText('vib');
            }
        }

        const isBiLevelQualifiedForSku = userUtils.isBiLevelQualifiedFor(currentSku);

        //changes interaction depending on user status for BI Qualification
        let userHandler;
        let userActionText;

        if (this.state.isUserAnonymous) {
            userHandler = this.signInHandler;
            userActionText = getText('signIn');
        } else if ((this.state.isUserSignedIn || this.state.isUserRecognized) && !this.state.isUserBI) {
            userHandler = this.biRegisterHandler;
            userActionText = getText('signUp');
        }

        if (this.state.profileStatus === null || !userLabel || isBiLevelQualifiedForSku) {
            return null;
        } else {
            return (
                <Text
                    is='p'
                    lineHeight='tight'
                >
                    {getText('youMust')} {userLabel} {getText('toAccess')}.
                    <br />
                    <Link
                        onClick={userHandler}
                        color='blue'
                        underline={true}
                    >
                        {userActionText}
                    </Link>
                    {userActionText && ' or '}
                    <Link
                        href={Pages.BeautyInsider}
                        color='blue'
                        underline={true}
                    >
                        {getText('learnMore')}
                    </Link>
                </Text>
            );
        }
    }
}

export default wrapComponent(ProductQuickLookMessage, 'ProductQuickLookMessage');
