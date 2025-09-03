export default function getResource(label, vars = []) {
    const resources = {
        listsText: 'Lists',
        firstDisclaimer: '† You will receive 1 Beauty Insider point as an Insider, 1.25 Beauty Insider points with VIB status, or 1.5 Beauty Insider points with Rouge status for every dollar spent on merchandise (excludes the purchase of egift certificates, gift cards, ticket purchases for special Sephora events taxes or shipping.) online or in Sephora retail stores.',
        secondDisclaimer: `The dollar amount you spend in a year counts toward your Beauty Insider status. Points carry over from year to year. Year-to-date spend resets every year on January 1. Details from last year are available here, and you can view your previous purchase history in your ${vars[0]}`,
        thirdDisclaimer: 'Beauty Bank Totals and Spend details from transactions on or before July 1, 2014 are not available for online viewing.'
    };

    return resources[label];
}
