import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import {
    colors, fontSizes, letterSpacings, lineHeights, space
} from 'style/config';
import dateUtils from 'utils/Date';
import orderUtils from 'utils/Order';
import { Text, Link } from 'components/ui';

import localeUtils from 'utils/LanguageLocale';

const TABLE_PADDING = space[4];
const ZAPPOS_ACTIVITY_LOCATION = 'ZAPPOS.COM';

const { getOrderDetailsUrl } = orderUtils;

class PointsNSpendGrid extends BaseClass {
    constructor(props) {
        super(props);
    }

    render() {
        const getText = localeUtils.getLocaleResourceFile(
            'components/RichProfile/BeautyInsider/PointsNSpendBank/PointsNSpendGrid/locales',
            'PointsNSpendGrid'
        );

        const { activities, type, typeLabel, total } = this.props;

        const TRANSACTION_TYPES = {
            EARNED: 'earned',
            SPENT: 'spent'
        };

        const style = {
            width: '100%',
            borderCollapse: 'collapse',
            lineHeight: lineHeights.tight,
            textAlign: 'left',
            '& th, & td': {
                paddingTop: TABLE_PADDING,
                paddingBottom: TABLE_PADDING,
                verticalAlign: 'top',
                '&:not(:first-child)': {
                    backgroundColor: colors.nearWhite,
                    width: '20%',
                    paddingLeft: TABLE_PADDING / 2,
                    paddingRight: TABLE_PADDING / 2,
                    textAlign: 'center'
                },
                '&:last-child': {
                    borderLeftWidth: 2,
                    borderLeftStyle: 'solid',
                    borderLeftColor: colors.white,
                    fontWeight: 'var(--font-weight-bold)'
                }
            },
            '& th': {
                fontSize: fontSizes.sm,
                textTransform: 'uppercase',
                fontWeight: 'var(--font-weight-bold)',
                letterSpacing: letterSpacings[1],
                borderBottom: `2px solid ${colors.white}`,
                paddingTop: TABLE_PADDING + 2,
                '&:first-child': { borderBottomColor: colors.nearWhite }
            },
            '& td': {
                borderBottom: `1px solid ${colors.nearWhite}`,
                '&:first-child': { borderBottomColor: colors.lightGray }
            }
        };

        const rows = activities.map(activity => {
            let update = activity.pointsUpdate;
            let balance = `${activity.pointsBalance}`;
            let symbol = '';
            const isZapposOrder = activity?.location?.includes(ZAPPOS_ACTIVITY_LOCATION);

            if (type === TRANSACTION_TYPES.SPENT) {
                update = activity.spendUpdate;
                balance = activity.ytdSpend;
                symbol = '$';
            }

            const earnedSpendValue = () => {
                if (update === 0) {
                    return '—';
                }

                if (type === TRANSACTION_TYPES.EARNED) {
                    return `${update > 0 ? '+' : ''}${update}`;
                } else {
                    return update < 0 ? `-${symbol}${Math.abs(update)}` : `${symbol}${update}`;
                }
            };

            return (
                <React.Fragment key={`${activity.orderID || activity.partnerOrderID}_${activity.activityDate}`}>
                    <tr>
                        <td>
                            <div>{dateUtils.formatDateMDY(activity.activityDate, true)}</div>
                            <Text css={{ textTransform: 'capitalize' }}>{activity.location}</Text>
                            <div>{activity.activityType}</div>
                            {activity.description && <div>{activity.description}</div>}
                            {activity.orderID && (
                                <div>
                                    {`${getText('orderText')} #: `}
                                    <Link
                                        color='blue'
                                        underline={true}
                                        href={getOrderDetailsUrl(activity.orderID)}
                                    >
                                        {activity.orderID}
                                    </Link>
                                </div>
                            )}
                            {activity.partnerOrderID && !isZapposOrder && <div>{`${getText('orderText')} #: ${activity.partnerOrderID}`}</div>}
                        </td>
                        <td>{earnedSpendValue()}</td>
                        <td>{update === 0 ? '—' : `${symbol}${balance}`}</td>
                    </tr>
                </React.Fragment>
            );
        });

        return (
            <table css={style}>
                <thead>
                    <tr>
                        <th>{getText('dateLocationText')}</th>
                        <th>{typeLabel}</th>
                        <th>{total}</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
}

export default wrapComponent(PointsNSpendGrid, 'PointsNSpendGrid', true);
