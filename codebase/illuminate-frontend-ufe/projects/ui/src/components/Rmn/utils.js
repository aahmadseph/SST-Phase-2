const isRmnCombinedCallFeatureEnabled = () => {
    return !!Sephora?.configurationSettings?.smnBrowseCombinedCallEnabled;
};

export default isRmnCombinedCallFeatureEnabled;
