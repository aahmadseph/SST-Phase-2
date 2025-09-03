import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import OrderUtils from 'utils/Order';

const { getOccupationalTax } = OrderUtils;
const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/SharedComponents/OcuppationalTaxItem/locales', 'OccupationalTaxItem');

const fields = createSelector(
    createStructuredSelector({
        occupationalTaxItems: state => {
            const occupationalTaxItems = [];
            const foundRawTaxes = getOccupationalTax(state.order?.orderDetails);

            for (const key in foundRawTaxes) {
                if (Object.hasOwnProperty.call(foundRawTaxes, key)) {
                    const value = foundRawTaxes[key];
                    const taxItemText = getTextFromResource(getText, key || 'default')(state);

                    occupationalTaxItems.push({
                        taxItemText,
                        value
                    });
                }
            }

            return occupationalTaxItems;
        }
    }),
    ({ occupationalTaxItems }) => {
        const newProps = {
            occupationalTaxItems
        };

        return newProps;
    }
);

const withOccupationalTaxItemProps = wrapHOC(connect(fields));

export { withOccupationalTaxItemProps };
