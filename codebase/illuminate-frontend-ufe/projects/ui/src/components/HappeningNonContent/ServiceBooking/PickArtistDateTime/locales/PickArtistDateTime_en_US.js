export default function getResource(label, vars = []) {
    const resources = {
        store: 'Store',
        edit: 'Edit',
        pickAnArtist: 'Pick An Artist',
        anyAvailableArtist: 'Any available artist',
        artistAvailabilityNotice: 'Artist might change depending on availability that day.',
        continueToReviewAndPay: 'Continue to Review & Pay',
        pickDateAndTime: 'Pick A Date And Time',
        showCalendar: 'Show calendar',
        timeSlotsTooltip: 'Time slots not displayed are fully booked.',
        morning: 'Morning',
        afternoon: 'Afternoon',
        evening: 'Evening',
        before: 'Before',
        after: 'After',
        noAvailableTimes: 'No available times',
        pickDate: 'Pick A Date',
        done: 'Done',
        calendarMessage: `If you would like to schedule an appointment more than 90 days in advance, please call your preferred ${vars[0]}.`,
        today: 'Today',
        noTimeSlotsIn90DaysErrorMessage: `We're sorry, but there are no available slots for this service at this store within the next 90 days. Please consider calling the store directly to schedule, or ${vars[0]} for online booking.`,
        chooseAnotherLocation: 'choose another store location',
        noArtistTimeSlotsErrorMessage: 'We’re sorry, but there are no longer any time slots available on this date. Please try adjusting the artist and date selections above to find more availability.',
        joinWaitlist: 'Join Waitlist',
        timeSlotsNotShown: 'Time slots not shown are fully booked.',
        aboutTheWaitlist: 'About the Waitlist',
        waitlistHoldInfo: 'If more than 24 hours from now, join the waitlist and receive an email and an exclusive hold if availability opens that matches your preferred time range.',
        waitlistLearnMore: 'Learn More',
        joinWaitlistButton: 'Continue to Join Waitlist',
        noAvailableArtistTimes: 'Apologies, this service is fully booked at this store on the selected date. Please try adjusting the artist and date selections above to find more availability. (Or you can choose another store)',
        gotIt: 'Got It'
    };

    return resources[label];
}
