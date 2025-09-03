import React from 'react';
import baseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import anaUtils from 'analytics/utils';
import Chiclet from 'components/Chiclet';
import ShopModal from 'components/Header/ShopModal/ShopModal';
import Action from 'components/Content/Action';
import { Text } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import mediaUtils from 'utils/Media';

const { isMobileView } = mediaUtils;

const getText = localeUtils.getLocaleResourceFile('components/Homepage/ChicletNavExtended/locales', 'ChicletNavExtended');

const ActionChiclet = Action(Chiclet);

class ChicletNavExtended extends baseClass {
    handleChicletClick = item => () => {
        anaUtils.setNextPageData({
            navigationInfo: anaUtils.buildNavPath(['top nav', item.label.toLowerCase()]),
            internalCampaign: item.sid
        });
    };

    render() {
        const { menuItems } = this.props;

        if (isMobileView()) {
            return (
                <ShopModal
                    title={getText('shop')}
                    items={menuItems}
                />
            );
        }

        return (
            <>
                <Text
                    is='h2'
                    fontSize={['md', 'lg']}
                    fontWeight='bold'
                    marginTop={30}
                    marginBottom={14}
                    lineHeight='tight'
                    children={getText('shopByCategory')}
                />
                <div
                    css={styles.chicletWrap}
                    data-at={Sephora.debug.dataAt('category_chiclets')}
                >
                    {menuItems.map((item, index) => {
                        const componentSpecificProps = {
                            action: item.link,
                            children: item.label,
                            dontUseInternalTracking: true
                        };

                        return (item.titleText && item.targetUrl) || (item.label && item.link) ? (
                            <ActionChiclet
                                key={index.toString()}
                                variant='shadow'
                                fontSize={14}
                                minWidth={200}
                                minHeight={34}
                                {...componentSpecificProps}
                                onClick={this.handleChicletClick(item)}
                                children={componentSpecificProps.children}
                            />
                        ) : null;
                    })}
                </div>
            </>
        );
    }
}

const styles = {
    chicletWrap: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    }
};

export default wrapComponent(ChicletNavExtended, 'ChicletNavExtended');
