function getDaysInTransit(shippingGroup) {
    try {
        const promiseDate = shippingGroup?.shippingMethod?.promiseDate;

        if (promiseDate) {
            const targetDate = new Date(promiseDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const diffInMs = targetDate - today;
            const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

            return diffInDays;
        } else {
            return 0;
        }
    } catch (_) {
        return 0;
    }
}

export { getDaysInTransit };
