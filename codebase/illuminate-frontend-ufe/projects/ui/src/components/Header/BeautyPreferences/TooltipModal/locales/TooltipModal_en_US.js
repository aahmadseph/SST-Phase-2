export default function getResource(label, vars = []) {
    const resources = {
        tooltipColorIQTitle: 'Color IQ',
        buttonGotIt: 'Got It',
        tooltipColorIQSubtitle1:
            'Color IQ is a system unique to Sephora that helps you identify the correct shade in every foundation and concealer product. To get your Color IQ, head to your nearest Sephora and ask a Beauty Advisor to do a Color IQ reading for you. They will use a special camera to determine your skin tone and attributes. When you do so, the system will remember your data and add it to your profile here.',
        tooltipColorIQSubtitle2:
            'For best results, make sure to get a reading taken in both Summer and Winter months as our skin tones naturally change over the course of the year.'
    };

    return resources[label];
}
