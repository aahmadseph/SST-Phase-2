export default function getResource(label, vars = []) {
    const resources = {
        productsFromServices: 'Product recommendations from your services will show up here.',
        emptyServiceHeaderCopy: 'Looks like you don’t have any Beauty Advisor Recommendations yet.',
        emptyServiceHeaderBody: 'Treat yourself to a custom makeover. Product recommendations from your services will show up here.',
        bookReservation: 'Book a Reservation'
    };

    return resources[label];
}
