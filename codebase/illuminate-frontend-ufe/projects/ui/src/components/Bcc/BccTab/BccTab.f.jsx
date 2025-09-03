import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import anaUtils from 'analytics/utils';

function BccTab(props) {
    return (
        <BccComponentList
            onClick={() =>
                anaUtils.setNextPageData({
                    linkData: `tab:${props.name}`,
                    internalCampaign: props.name
                })
            }
            role='tabpanel'
            aria-labelledby={'tab' + props.name}
            tabIndex={0}
            id={'tabpanel' + props.name}
            items={props.componentList}
        />
    );
}

export default wrapFunctionalComponent(BccTab, 'BccTab');
