import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import Empty from 'constants/empty';
import ComponentList from 'components/Content/ComponentList';
import contentConstants from 'constants/content';
import autoReplenishmentConstants from 'constants/AutoReplenishment';

const { CONTEXTS } = contentConstants;
const { CARD_SIZE_CONFIG } = autoReplenishmentConstants;

class AutoReplenishEmptyHub extends BaseClass {
    componentDidMount() {
        if (this.props.shouldDisplaySignIn) {
            this.props.showSignInModal();
        }
    }

    render() {
        const { cmsData } = this.props;

        return (
            <div>
                {cmsData?.topContent && (
                    <ComponentList
                        items={cmsData.topContent}
                        context={CONTEXTS.CONTAINER}
                    />
                )}
                {cmsData?.middleContent && (
                    <ComponentList
                        items={cmsData.middleContent}
                        context={CONTEXTS.CONTAINER}
                        customCardSize={CARD_SIZE_CONFIG}
                    />
                )}
            </div>
        );
    }
}

AutoReplenishEmptyHub.defaultProps = {
    cmsData: Empty.Object,
    shouldDisplaySignIn: true
};

export default wrapComponent(AutoReplenishEmptyHub, 'AutoReplenishEmptyHub', true);
