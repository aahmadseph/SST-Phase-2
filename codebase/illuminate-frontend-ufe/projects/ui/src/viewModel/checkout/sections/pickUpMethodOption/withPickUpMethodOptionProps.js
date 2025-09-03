import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import curbsideConciergeInfoModal from 'selectors/modals/curbsideConciergeInfoModal/curbsideConciergeInfoModalSelector';
import CurbsideInstructionTabSelector from 'selectors/order/orderDetails/pickup/storeDetails/content/regions/curbsideInstructionTab/curbsideInstructionTabSelector';
import ModalActions from 'actions/ModalActions';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { curbsideInstructionTabSelector } = CurbsideInstructionTabSelector;
const { getCurbsideConciergeInfoModal } = ModalActions;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Checkout/Sections/PickUpMethodOption/locales', 'PickUpMethodOption');

const withPickUpMethodOptionProps = wrapHOC(
    connect(
        createStructuredSelector({
            curbsideConciergeInfoModal,
            curbsideInstructionTab: curbsideInstructionTabSelector,
            title: getTextFromResource(getText, 'curbsideConcierge'),
            whatItIs: getTextFromResource(getText, 'whatItIs'),
            whatToDo: getTextFromResource(getText, 'whatToDo'),
            footer: getTextFromResource(getText, 'gotIt'),
            curbsideConciergeAltText: getTextFromResource(getText, 'curbsideConciergeAltText'),
            inStorePickupAltText: getTextFromResource(getText, 'inStorePickupAltText')
        }),
        { getCurbsideConciergeInfoModal }
    )
);

export { withPickUpMethodOptionProps };
