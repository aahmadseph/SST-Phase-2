export default function getResource(label, vars=[]) {
    const resources = {
        sddRougePromoBannerTitle: 'Want your items today? ',
        sddRougePromoBannerMessage: `Rouge members can try Free Same-Day Delivery on $${vars[0]}+ orders! Check availability by tapping the "Get It Sooner" button.`,
        sddRougeMemberBannerMessage: 'Rouge members can also try Free Same-Day Delivery! Check availability by tapping the "Change Method" button.'
    };

    return resources[label];
}
