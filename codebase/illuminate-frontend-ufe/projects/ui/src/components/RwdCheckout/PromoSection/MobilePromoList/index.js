import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import MobilePromoList from 'components/RwdCheckout/PromoSection/MobilePromoList/MobilePromoList';
import promosSelector from 'selectors/basket/promos/promosSelector';

const fields = createStructuredSelector({
    promos: promosSelector
});

const withMobilePromoListProps = connect(fields);

export default withMobilePromoListProps(MobilePromoList);
