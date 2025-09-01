# Table of contents for the `reducers` folder

-   [Overview](#overview)
-   [Reference implementation of reducer](#reference-implementation-of-reducer)

# Overview

A reducer (also called a reducing function) is a function that accepts an accumulation and a value and returns a new accumulation. They are used to reduce a collection of values down to a single value.

Reducers are not unique to `Redux` — they are a fundamental concept in functional programming. Even most non-functional languages, like JavaScript, have a built-in API for reducing. In JavaScript, it's `Array.prototype.reduce()`.

In `Redux`, the accumulated value is the state object, and the values being accumulated are actions. Reducers calculate a new state given the previous state and an action. They must be pure functions — functions that return the exact same output for given inputs. They should also be free of side-effects. This is what enables exciting features like hot reloading and time travel.

Action types should be defined within the folder `projects/ui/src/constants/actionTypes/` and **not in action or reducer files**.

# Reference implementation of reducer

> Example from: <em>projects/ui/src/reducers/page/autoReplenishment.js</em>

```js
import { UPDATE_SUBSCRIPTIONS, UNSUBSCRIBE_AUTOREPLENISHMENT, LOAD_SHIPPING_AND_PAYMENT_INFO } from 'constants/actionTypes/autoReplenishment';

const initialState = {
    subscriptions: {
        subscriptions: [],
        numOfPagesLoaded: 0
    },
    shippingAndPaymentInfo: {
        shippingAddress: {},
        payment: {}
    }
};

const reducer = function (state = initialState, { type, payload }) {
    switch (type) {
        case UPDATE_SUBSCRIPTIONS: {
            return {
                ...state,
                subscriptions: {
                    ...payload,
                    numOfPagesLoaded: state.subscriptions.numOfPagesLoaded + 1,
                    subscriptions: state.subscriptions.subscriptions.concat(payload.subscriptions)
                }
            };
        }
        case UNSUBSCRIBE_AUTOREPLENISHMENT: {
            return {
                ...state,
                subscriptions: {
                    ...payload,
                    subscriptions: state.subscriptions?.subscriptions?.filter(({ subscriptionId }) => subscriptionId !== payload.subscriptionId)
                }
            };
        }
        case LOAD_SHIPPING_AND_PAYMENT_INFO: {
            return {
                ...state,
                shippingAndPaymentInfo: payload
            };
        }
        default: {
            return state;
        }
    }
};

module.exports = {
    reducer,
    initialState
};
```
