import { createSelector } from 'reselect';
import Empty from 'constants/empty';
import { regionsSelector } from 'selectors/order/orderDetails/pickup/storeDetails/content/regions/regionsSelector';

const curbsideInstructionTabSelector = createSelector(regionsSelector, regions => regions.curbsideInstructionTab || Empty.Array);

export default { curbsideInstructionTabSelector };
