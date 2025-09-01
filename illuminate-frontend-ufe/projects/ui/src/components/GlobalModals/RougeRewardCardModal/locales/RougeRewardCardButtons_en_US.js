export default function getResource(label, vars = []) {
    const resources = {
        checkboxContentIsModalCheckbox: 'I agree to the',
        beautyInsiderTC: 'Beauty Insider Terms & Conditions',
        rougeRewardValid: 'Rouge Reward is valid on <b>a future transaction only</b>, it <b>expires in 90 days</b>, and it will be sent via email within <b>24 hours</b>.',
        done: 'Done',
        youMustAcceptTermsConditions: 'You must accept terms and conditions first.'
    };
    return resources[label];
}
