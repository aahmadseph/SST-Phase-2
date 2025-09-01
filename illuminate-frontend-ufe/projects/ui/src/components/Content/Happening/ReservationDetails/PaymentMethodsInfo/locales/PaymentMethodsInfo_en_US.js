export default function getResource(label, vars=[]){
    const resources = {
        payment: 'Payment',
        estimatedCost: 'Estimated Cost',
        taxesHit: '*state and local tax not displayed',
        paymentHold: 'Payment Method on hold',
        paymentUsed: 'Payment Method used',
        paymentMethodsUsed: 'Payment Methods used',
        servicePayment: 'Service Payment',
        noShowFee: 'No Show Fee',
        lateCancellationFee: 'Late Cancelation Fee',
        tip: 'Tip',
        viewPolicies: 'View Policies',
        refund: `- $${vars[0]} Refund`,
        CARD: 'Card',
        ONLINE_CREDIT: 'Online Credit'
    };
    return resources[label];
}
