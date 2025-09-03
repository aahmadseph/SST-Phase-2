const ShoppingListUtils = {
    isSLSServiceEnabled: () => {
        if (Sephora.configurationSettings.isSLSServiceEnabled) {
            return true;
        }

        return false;
    }
};

export default ShoppingListUtils;
