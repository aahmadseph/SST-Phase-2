/* eslint-disable class-methods-use-this */
import React from 'react';

import { wrapFunctionalComponent } from 'utils/framework';

//const sampleContent = 'Use promo code **872346** to qualify for 15% off your next purchase. <Enhancer type="notImplementedYet" args="underline,italic,green">**Apply Now ▸**</Enhancer> You can get 15% off your next purchase. <Enhancer type="notImplementedYet" args="1,2,,3,4">Sign in</Enhancer> to qualify!';

function SampleEnhancer(props) {
    const { children, args } = props;

    const textDecoration = args[0] !== '' ? args[0] : 'initial';
    const icon = args[1] !== '' ? args[1] : '';
    const fontStyle = args[2] !== '' ? args[1] : 'inherit';
    const color = args[3] !== '' ? args[2] : 'inherit';

    const styles = {
        textDecoration,
        fontStyle,
        color
    };

    return (
        <span style={styles}>
            {!!icon && <img src={`${icon}`} />}
            {children}
        </span>
    );
}

export default wrapFunctionalComponent(SampleEnhancer, 'SampleEnhancer');
