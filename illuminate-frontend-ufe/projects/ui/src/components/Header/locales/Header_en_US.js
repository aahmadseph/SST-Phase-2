const resources = {
    storesAndServices: 'Stores & Services',
    shopStoreAndDelivery: 'Shop Store & Delivery',
    chooseYourStore: 'Choose your store',
    chooseYourLocation: 'Choose your location',
    chooseYourStoreAndLocation: 'Choose your store & location',
    home: 'Home',
    shop: 'Shop',
    offers: 'Offers',
    me: 'Me',
    signIn: 'Sign In',
    community: 'Community',
    servicesAndEvents: 'Services & Events',
    store: 'Stores',
    myStore: 'My Store',
    tooltip: 'Sign in (or sign up!) for offers, points, and more.',
    homepage: 'Sephora Homepage'
};

export default function getResource(label) {
    return resources[label];
}
