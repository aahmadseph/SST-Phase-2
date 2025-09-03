import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import SingleView from 'components/Reward/RrcPromo/SingleView';
import MultipleView from 'components/Reward/RrcPromo/MultipleView';

function RrcPromo({ availableRrcCoupons, ...props }) {
    const view =
        availableRrcCoupons.coupons.length > 1 ? (
            <MultipleView
                coupons={availableRrcCoupons.coupons}
                {...props}
            />
        ) : (
            <SingleView
                coupon={availableRrcCoupons.coupons[0]}
                {...props}
            />
        );

    return view;
}

RrcPromo.defaultProps = {
    paddingX: 4,
    borderWidth: 1,
    borderColor: 'midGray',
    borderRadius: 2,
    applyConfig: { minWidth: '7.5em' },
    iconGap: 3
};

export default wrapFunctionalComponent(RrcPromo, 'RrcPromo');
