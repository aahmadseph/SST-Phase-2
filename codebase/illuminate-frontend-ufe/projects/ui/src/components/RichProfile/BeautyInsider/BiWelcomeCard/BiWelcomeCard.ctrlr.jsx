import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import Actions from 'Actions';
import store from 'store/Store';
import biProfileUtils from 'utils/BiProfile';

import { Box, Image, Button } from 'components/ui';
import SignInSignUp from 'components/RichProfile/BeautyInsider/SignInSignUp/SignInSignUp';
import BiBackground from 'components/RichProfile/BeautyInsider/BiBackground/BiBackground';
import userUtils from 'utils/User';
import BiUnavailable from 'components/Reward/BiUnavailable/BiUnavailable';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
//I18n
import localeUtils from 'utils/LanguageLocale';

const showBiRegisterModal = Actions.showBiRegisterModal;

class BiWelcomeCard extends BaseClass {
    constructor(props) {
        super(props);
        this.state = { biDown: false };
    }

    componentDidMount() {
        if (biProfileUtils.isBiDown()) {
            this.setState({ biDown: true });
        }
    }

    joinBi = e => {
        e.preventDefault();
        store.dispatch(showBiRegisterModal({ isOpen: true }));
    };

    renderSignInSignUp = () => {
        return userUtils.isAnonymous() ? <SignInSignUp /> : this.renderJoinNow();
    };

    renderJoinNow = () => {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/BeautyInsider/BiWelcomeCard/locales', 'BiWelcomeCard');

        const isMobile = Sephora.isMobile();

        return (
            <Box textAlign='center'>
                <Box
                    fontSize='md'
                    lineHeight='none'
                    marginTop={isMobile && 2}
                    fontFamily='serif'
                >
                    {getText('welcomeTo')}
                </Box>
                <Image
                    display='block'
                    src='/img/ufe/bi/logo-beauty-insider.svg'
                    alt={getText('beautyInsider')}
                    width={240}
                    height={36}
                    marginX='auto'
                    marginTop={2}
                    marginBottom={4}
                />
                <Button
                    variant='primary'
                    block={isMobile}
                    onClick={this.joinBi}
                    hasMinWidth={true}
                    data-at={Sephora.debug.dataAt('join_bi')}
                >
                    {getText('joinNow')}
                </Button>
            </Box>
        );
    };

    render() {
        const isMobile = Sephora.isMobile();

        return this.state.biDown ? (
            <LegacyContainer
                marginTop={isMobile ? 4 : 5}
                marginBottom={isMobile ? 4 : 6}
            >
                <BiUnavailable
                    borderRadius={2}
                    justifyContent='center'
                />
            </LegacyContainer>
        ) : (
            <BiBackground {...this.props}>{this.renderSignInSignUp()}</BiBackground>
        );
    }
}

export default wrapComponent(BiWelcomeCard, 'BiWelcomeCard');
