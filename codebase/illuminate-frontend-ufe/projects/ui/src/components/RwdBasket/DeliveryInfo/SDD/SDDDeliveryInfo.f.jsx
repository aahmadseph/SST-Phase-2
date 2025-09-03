import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import store from 'store/Store';
import { colors, fontSizes, lineHeights } from 'style/config';
import { Text, Link } from 'components/ui';
import Markdown from 'components/Markdown/Markdown';
import actions from 'actions/Actions';
import localeUtils from 'utils/LanguageLocale';
import helpersUtils from 'utils/Helpers';

const { dispatch } = store;
const { showShippingDeliveryLocationModal } = actions;
const { getLocaleResourceFile } = localeUtils;
const { replaceDoubleAsterisks } = helpersUtils;

function SDDDeliveryInfo({ zipCode, message, sameDayIsAvailable, isMessageBold }) {
    const getText = getLocaleResourceFile('components/RwdBasket/DeliveryInfo/SDD/locales', 'SDDDeliveryInfo');
    const handleOpenLocationModal = () => {
        dispatch(showShippingDeliveryLocationModal({ isOpen: true }));
    };

    const DeliveringToLabel = () => (
        <span
            data-at={Sephora.debug.dataAt('bsk_delivering_to_label')}
            children={`${getText('deliveringTo')}`}
        />
    );

    const ZipCodeButton = ({ isLink, onClick }) => {
        const Component = isLink ? Link : Text;
        const commonProps = {
            dataAt: Sephora.debug.dataAt('bsk_choose_zipcode_btn'),
            children: zipCode || getText('yourLocation'),
            fontWeight: 'bold'
        };
        const linkProps = isLink ? { onClick, arrowDirection: 'down' } : {};

        return (
            <Component
                {...commonProps}
                {...linkProps}
            />
        );
    };

    const errorMessage = !sameDayIsAvailable && (
        <p>
            {getText('notAvailable')}
            <Link
                dataAt={Sephora.debug.dataAt('bsk_choose_zipcode_btn')}
                fontWeight={'bold'}
                onClick={handleOpenLocationModal}
                arrowDirection={'down'}
                children={zipCode}
            />
        </p>
    );

    return (
        <div>
            {!sameDayIsAvailable ? (
                <>
                    {errorMessage}
                    <Link
                        data-at={Sephora.debug.dataAt('bsk_choose_zipcode_btn')}
                        paddingTop={1}
                        color={colors.blue}
                        fontSize={fontSizes.base}
                        lineHeight={lineHeights.tight}
                        onClick={handleOpenLocationModal}
                    >
                        {'Change location'}
                    </Link>
                </>
            ) : (
                <>
                    <DeliveringToLabel />
                    <ZipCodeButton
                        isLink={true}
                        onClick={handleOpenLocationModal}
                    />
                </>
            )}

            {message && sameDayIsAvailable && (
                <Text
                    data-at={Sephora.debug.dataAt('bsk_sameday_order_by_label')}
                    is={'p'}
                    marginTop={1}
                    color={sameDayIsAvailable ? 'green' : 'black'}
                    fontSize={['sm', 'base']}
                    fontWeight={isMessageBold ? 'bold' : null}
                >
                    <Markdown
                        is='span'
                        css={styles.sddMessageMarkdown}
                        content={replaceDoubleAsterisks(message)}
                    />
                </Text>
            )}
        </div>
    );
}

const styles = {
    sddMessageMarkdown: {
        '& > :first-child': {
            display: 'inline'
        }
    }
};

export default wrapFunctionalComponent(SDDDeliveryInfo, 'SDDDeliveryInfo');
