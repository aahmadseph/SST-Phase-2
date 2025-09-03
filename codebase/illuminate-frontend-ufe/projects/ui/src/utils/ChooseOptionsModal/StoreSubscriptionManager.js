import store from 'Store';
import watch from 'redux-watch';

class StoreSubscriptionManager {
    constructor() {
        this.subscriptions = [];
    }

    createProductSubscription(setState) {
        const currentSkuWatch = watch(store.getState, 'product');

        const unsubscribe = store.subscribe(
            currentSkuWatch(newVal => {
                if (newVal.currentSku !== null) {
                    setState(prevState => ({
                        ...prevState,
                        currentSku: newVal.currentSku,
                        product: Object.assign({}, prevState.product, {
                            currentSku: newVal.currentSku
                        })
                    }));
                }
            })
        );

        this.subscriptions.push(unsubscribe);

        return unsubscribe;
    }

    createPreferredStoreSubscription(setState) {
        const preferredStoreWatch = watch(store.getState, 'user.preferredStoreInfo');

        const unsubscribe = store.subscribe(
            preferredStoreWatch(newVal => {
                setState(prevState => {
                    if (newVal !== prevState.preferredStoreInfo) {
                        return {
                            ...prevState,
                            preferredStoreInfo: newVal || null
                        };
                    }

                    return prevState;
                });
            })
        );

        this.subscriptions.push(unsubscribe);

        return unsubscribe;
    }

    unsubscribeAll() {
        this.subscriptions.forEach(unsubscribe => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        });
        this.subscriptions = [];
    }

    static createInstance() {
        return new StoreSubscriptionManager();
    }
}

export default StoreSubscriptionManager;
