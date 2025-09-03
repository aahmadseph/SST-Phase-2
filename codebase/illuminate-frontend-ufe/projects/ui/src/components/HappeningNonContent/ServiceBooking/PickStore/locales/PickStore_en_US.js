export default function getResource(label, vars = []) {
    const resources = {
        pickAStore: 'Pick A Store',
        showMap: 'Show map',
        hideMap: 'Hide map',
        showMoreLocations: 'Show more locations',
        continueToPickArtist: 'Continue to Pick an Artist, Date, and Time',
        noResultsFound: 'No Results Found',
        noResultsMessage: 'We couldn\'t find any stores matching your search. Please refine your search criteria and try again.',
        ok: 'Ok',
        noStoresErrorMessage: 'We’re sorry, we couldn’t find any stores within 50 miles that offer this service. Please adjust your search criteria and try again.'
    };

    return resources[label];
}
