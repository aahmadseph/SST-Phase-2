import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import { Text, Divider, Link } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';

class BIPointsWarnings extends BaseClass {
    constructor(props) {
        super(props);
    }

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/BeautyInsider/PointsNSpendBank/locales', 'BIPointsWarnings');

        const isMobile = Sephora.isMobile();

        return (
            <div>
                <Text
                    is='p'
                    marginBottom={!isMobile ? 5 : null}
                >
                    {getText('rewardRedemptionsText')}
                </Text>
                {isMobile && <Divider marginY={4} />}
                {this.props.noPoints && (
                    <Text
                        data-at={Sephora.debug.dataAt('bi_activity_text')}
                        is='p'
                        textAlign={isMobile ? 'center' : null}
                        marginBottom={5}
                        fontWeight='bold'
                    >
                        {getText('noActivityText')}
                    </Text>
                )}
                {this.props.expired && (
                    <Text
                        is='p'
                        textAlign={isMobile ? 'center' : null}
                        marginBottom={5}
                    >
                        <b>{getText('pointsExpiredText')}</b>{' '}
                        <Link
                            block={isMobile}
                            marginTop={isMobile ? 2 : null}
                            marginX='auto'
                            color='blue'
                            underline={true}
                        >
                            {getText('earnPointsText')}
                        </Link>
                    </Text>
                )}
                {isMobile || <Divider />}
            </div>
        );
    }
}

export default wrapComponent(BIPointsWarnings, 'BIPointsWarnings');
