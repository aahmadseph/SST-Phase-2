export default function getResource(label, vars = []) {
    const resources = {
        chooseOne: 'Please choose one:',
        singleCbrPointsNonRefundable: 'Points applied for Beauty Insider Cash are nonrefundable.',
        pointsNonrefundable: 'Points applied for Beauty Insider Cash or Points for Discount are nonrefundable.',
        applyPoints: 'Apply Points',
        applyPointsLong: 'Apply Points to Your Purchase',
        upto: 'Up to',
        youNowHaveText: `You now have *${vars[0]}* points`,
        youAreExceeding: `You are exceeding by *${vars[0]}* points`,
        gotIt: 'Got It',
        available: 'available',
        applied: 'Applied',
        orderSubtotal: 'Order Subtotal',
        off: 'off',
        BeautyInsiderCashTitle: 'Beauty Insider Cash',
        PointsForDiscountTitle: 'Points for Discount Event',
        cbrPointsApplied: `*${vars[0]}* applied`,
        pfdPointsApplied: `*${vars[0]}% off* applied`,
        singleCbrNoPfdPoints: `*${vars[0]} off* (${vars[1]} points)`,
        singleCbrWithPfdPoints: `*${vars[0]} off* or up to *${vars[1]}% off*`,
        manyCbrWithPfdPoints: `Up to *${vars[0]} off* or *${vars[1]}% off*`,
        pfdPointsOnly: `Up to *${vars[0]}% off*`,
        cbrPointsOnly: `Up to *${vars[0]}* available`,
        ends: `Ends ${vars[0]}`,
        remove: 'Remove',
        apply: 'Apply',
        points: 'points',
        cbrTitle: 'Beauty Insider Cash',
        useBiPoints: 'Use Your Beauty Insider Points'
    };

    return resources[label];
}
