export default function getResource(label, vars=[]) {
    const resources = {
        changeCountry: 'Change Country',
        changeCountryMessage: `In order to search for stores in ${vars[0]}, please go to the ${vars[1]} and change your country to ${vars[0]}.`,
        switchCountryBasketMessage: `Once you switch, any ${vars[0]}-restricted and/or Reserve & Pickup items will be removed from your basket.`,
        bottomOfTheSite: 'bottom of the site',
        ok: 'Ok',
        joinUsUntil: 'Join us until',
        MORNING: 'Morning Before 11:45 AM',
        AFTERNOON: 'Afternoon 12:00 PM to 4:45 PM',
        EVENING: 'Evening After 5:00 PM',
        exclusiveHoldUntil: 'exclusive hold until',
        on: 'on',
        youFoundAnotherTime: 'You Found Another Time',
        doYouWantToCancelPrevWaitlistAppt: `Do you want to cancel your previous Waitlist appointment for ${vars[0]} in the ${vars[1]}?`,
        no: 'No',
        yesCancel: 'Yes, Cancel'
    };

    return resources[label];
}
