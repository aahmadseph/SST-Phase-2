export default function getResource(label, vars = []) {
    const resources = {
        rsvpTitle: 'RSVP for This Event',
        showMoreLocations: 'Show more locations & dates',
        showLess: 'Show less',
        addToCalendar: 'Add to Calendar',
        rsvp: 'RSVP',
        manageRsvp: 'Manage RSVP'
    };

    return resources[label];
}
