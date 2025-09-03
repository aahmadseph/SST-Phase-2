/* eslint-disable class-methods-use-this */
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import React from 'react';
import { Text, Link } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import { mediaQueries, colors } from 'style/config';
class PazePaymentMethod extends BaseClass {
    componentDidMount() {
        const { loadIframe, errorMessage } = this.props;
        loadIframe({ errorMessage });
    }

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Paze/PazePaymentMethod/locales', 'PazePaymentMethod');
        const iframeURL = Sephora.configurationSettings.pazeIframe;
        const { isFrictionless } = this.props;

        return (
            <>
                <iframe
                    css={styles.iframe}
                    src={iframeURL}
                ></iframe>
                <Text
                    is='p'
                    fontSize='xs'
                    {...(isFrictionless && { marginBottom: [2, 1], marginTop: 4 })}
                >
                    {getText('legalNotice')}
                    <Link
                        color={colors.blue}
                        href='https://www.paze.com/service-agreement'
                    >
                        {getText('pazeTerms')}
                    </Link>
                    {getText('legalNotice02')}
                    <Link
                        color={colors.blue}
                        href='https://www.paze.com/service-privacy-notice'
                    >
                        {getText('pazePolicy')}
                    </Link>
                    .
                </Text>
            </>
        );
    }
}

const styles = {
    iframe: {
        height: '310px',
        width: '80%',
        [mediaQueries.xsMax]: {
            width: '100%'
        }
    }
};

export default wrapComponent(PazePaymentMethod, 'PazePaymentMethod', true);
