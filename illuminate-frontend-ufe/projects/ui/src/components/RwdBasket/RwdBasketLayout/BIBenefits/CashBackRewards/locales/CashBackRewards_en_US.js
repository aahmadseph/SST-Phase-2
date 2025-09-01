export default function getResource(label, vars = []) {
    const resources = {
        title: 'Apply Points',
        newTitle: 'Apply Beauty Insider Cash',
        apply: 'Apply',
        applied: 'Applied',
        remove: 'Remove',
        amountApplied: `<b>${vars[0]}</b> off applied`,
        newAmountApplied: `<b>${vars[0]}</b> applied`,
        pointsAppliedLegal: 'Points applied for Beauty Insider Cash are non-refundable.',
        multiplePromoSubTitle: `Up to <b>${vars[0]}</b> off available`,
        newMultiplePromoSubTitle: `Redeem ${vars[0]} points for <b>${vars[1]} off</b>`,
        singlePromoSubTitle: `<b>${vars[0]} off</b> (${vars[1]} points)`,
        newSinglePromoSubTitle: `Redeem ${vars[0]} points for <b>${vars[1]} off</b>`,
        modalTitle: 'Apply Points to Your Purchase',
        modalSubTitle: `You currently have <b>${vars[0]}</b> points`,
        done: 'Done',
        biCashAmount: `<b>${vars[0]}</b> Beauty Insider Cash`,
        pointsAmount: `${vars[0]} points`,
        subtotal: 'Order Subtotal',
        chooseText: 'Please choose one:',
        moreInfo: 'More Info'
    };

    return resources[label];
}
