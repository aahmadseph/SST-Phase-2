import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Text, Link } from 'components/ui';
import userUtils from 'utils/User';
import localeUtils from 'utils/LanguageLocale';
import { Pages } from 'constants/Pages';
import store from 'store/Store';
import auth from 'utils/Authentication';
import Actions from 'actions/Actions';
import { HEADER_VALUE } from 'constants/authentication';

const { getLocaleResourceFile } = localeUtils;
const { showBiRegisterModal } = Actions;

class BiQualify extends BaseClass {
    state = {
        isUserAnonymous: true,
        isBiLevelQualifiedFor: false
    };

    componentDidMount() {
        store.setAndWatch('user', this, () => {
            this.setState({
                isUserAnonymous: userUtils.isAnonymous(),
                isBiLevelQualifiedFor: userUtils.isBiLevelQualifiedFor(this.props.currentSku)
            });
        });
    }

    signInHandler = () => {
        auth.requireAuthentication(false, null, null, null, false, HEADER_VALUE.USER_CLICK).catch(() => {});
    };

    componentDidUpdate(prevProps) {
        if (prevProps.currentSku && prevProps.currentSku.skuId !== this.props.currentSku.skuId) {
            this.setState({ isBiLevelQualifiedFor: userUtils.isBiLevelQualifiedFor(this.props.currentSku) });
        }
    }

    biRegisterHandler = () => {
        // sign up for beauty insider modal needs to be implemented
        store.dispatch(showBiRegisterModal({ isOpen: true }));
    };

    render() {
        const { currentSku, ...props } = this.props;

        const getText = getLocaleResourceFile('components/BiQualify/locales', 'BiQualify');
        //changes BI Qualification user message dependent on bi level of sku

        const userLabel = userUtils.displayBiStatus(currentSku.biExclusiveLevel.toUpperCase());

        //changes interaction depending on user status for BI Qualification

        if (!this.state.isBiLevelQualifiedFor) {
            return (
                <Text
                    is='p'
                    lineHeight='tight'
                    data-at={Sephora.debug.dataAt('bi_qualify_message')}
                    {...props}
                >
                    {getText('userLabelText', [userLabel])}{' '}
                    {this.state.isUserAnonymous ? (
                        <span>
                            <Link
                                color='blue'
                                data-at={Sephora.debug.dataAt('bi_qualify_sign_in')}
                                onClick={this.signInHandler}
                            >
                                {getText('signIn')}
                            </Link>{' '}
                            or{' '}
                        </span>
                    ) : userUtils.isBI() ? null : (
                        <span>
                            <Link
                                color='blue'
                                data-at={Sephora.debug.dataAt('bi_qualify_sign_up')}
                                onClick={this.biRegisterHandler}
                            >
                                {getText('signUp')}
                            </Link>{' '}
                            {getText('or')}{' '}
                        </span>
                    )}
                    <Link
                        color='blue'
                        data-at={Sephora.debug.dataAt('bi_qualify_learn_more')}
                        href={Pages.BeautyInsider}
                    >
                        {getText('learnMore')}
                    </Link>
                </Text>
            );
        } else {
            return null;
        }
    }
}

export default wrapComponent(BiQualify, 'BiQualify', true);
