export const getRoktIdentifier = name => {
    return {
        confirmation: Sephora.UFE_ENV === 'PROD' ? 'prd.rokt.confirmation' : 'stg.rokt.confirmation'
    }[name];
};
