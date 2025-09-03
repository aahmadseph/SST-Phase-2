import withClientSideRenderOnly from 'hocs/withClientSideRenderOnly';
import withAfterEventsRendering from 'hocs/withAfterEventsRendering';
import AutoReplenishmentPageContent from 'components/RichProfile/MyAccount/AutoReplenishment/AutoReplenishmentPageContent/AutoReplenishmentPageContent';

import { withAutoReplenishmentPageContentProps } from 'viewModel/richProfile/myAccount/autoReplenishment/autoReplenishmentPageContent/withAutoReplenishmentPageContentProps';

export default withAfterEventsRendering(withClientSideRenderOnly()(withAutoReplenishmentPageContentProps(AutoReplenishmentPageContent)), [
    'UserInfoReady'
]);
