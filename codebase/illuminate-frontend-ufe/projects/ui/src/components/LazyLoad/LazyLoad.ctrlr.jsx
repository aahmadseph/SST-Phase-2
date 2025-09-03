import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import lazyLoadUtils from 'utils/framework/LazyLoad';
import Loader from 'components/Loader/Loader';
import { wrapComponent } from 'utils/framework';

const LazyLoadService = lazyLoadUtils.LazyLoaderInstance;

class LazyLoad extends BaseClass {
    constructor(props) {
        super(props);

        this.state = { component: null };
    }

    componentDidMount() {
        LazyLoadService.registerComponent(this);
        LazyLoadService.addLazyComponent(this, this.load);
    }

    componentWillUnmount() {
        LazyLoadService.unregisterComponent(this);
    }

    load = () => {
        const { component, title = '' } = this.props;
        // eslint-disable-next-line no-console
        console.log(`${performance.now()} [LazyLoad] name: '${component.displayName}', title: '${title}'`);

        this.setState({ component });
    };

    beginReset = () => {
        this.resetMode = true;
    };

    endReset = () => {
        this.resetMode = false;
        this.setState({ component: null }, () => LazyLoadService.addLazyComponent(this, this.load));
    };

    render() {
        const {
            id,
            minHeight = 155,
            // componentClass is included explicitly even though not used so that it won't be included in componentProps
            component,
            showLoader = false,
            ...restProps
        } = this.props;

        if (!this.resetMode && this.state.component) {
            const Component = this.state.component;

            return (
                <Component
                    id={id}
                    {...restProps}
                />
            );
        }

        return (
            <div
                id={id}
                className='lazy-load'
                css={{
                    position: 'relative',
                    minHeight
                }}
            >
                {showLoader ? <Loader isShown={true} /> : null}
            </div>
        );
    }
}

LazyLoad.propTypes = {
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired
};

export default wrapComponent(LazyLoad, 'LazyLoad', true);
