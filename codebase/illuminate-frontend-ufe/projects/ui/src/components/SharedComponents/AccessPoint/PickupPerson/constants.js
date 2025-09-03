import { space } from 'style/config';
import { itemWidths } from 'components/Product/ProductListItem/constants';

const isMobile = Sephora.isMobile();
const leftColWidth = itemWidths.IMAGE + space[5];

export {
    leftColWidth, isMobile
};
