import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import store from 'store/Store';
import Loader from 'components/Loader/Loader';

class Interstice extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            isVisible: false
        };
    }

    componentDidMount() {
        import('redux-watch').then(({ default: watch }) => {
            const w = watch(store.getState, 'interstice');
            store.subscribe(
                w(newVal => {
                    this.setState({ isVisible: newVal.isVisible });
                }),
                this
            );
        });
    }

    render() {
        return (
            <Loader
                isFixed={true}
                isShown={this.state.isVisible}
                style={{ zIndex: 'var(--layer-max)' }}
            />
        );
    }
}

export default wrapComponent(Interstice, 'Interstice', true);
