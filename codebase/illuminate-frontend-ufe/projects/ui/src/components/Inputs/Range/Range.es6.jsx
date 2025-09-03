/* eslint-disable class-methods-use-this */
import React from 'react';

import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { colors } from 'style/config';
import RangeSlider from 'rc-slider/lib/Range';

class Range extends BaseClass {
    render() {
        const isTouch = Sephora.isTouch;
        const sliderHeight = isTouch ? 20 : 14;
        const sliderTrackHeight = isTouch ? 6 : 4;

        return (
            <RangeSlider
                max={this.props.max}
                min={this.props.min}
                value={this.props.value}
                step={this.props.step}
                allowCross={this.props.allowCross}
                onAfterChange={e => this.props.onChangeFinished(e)}
                onChange={e => this.props.onChange(e)}
                css={{
                    '&.rc-slider': {
                        position: 'relative',
                        height: sliderHeight,
                        marginLeft: sliderHeight / 2,
                        marginRight: sliderHeight / 2,
                        borderRadius: 99999,
                        touchAction: 'none'
                    },
                    '& .rc-slider-rail, & .rc-slider-track': {
                        position: 'absolute',
                        top: (sliderHeight - sliderTrackHeight) / 2,
                        left: 0,
                        height: sliderTrackHeight,
                        borderRadius: 99999
                    },
                    '& .rc-slider-rail': {
                        right: 0,
                        backgroundColor: colors.lightGray
                    },
                    '& .rc-slider-track': {
                        backgroundColor: colors.black
                    },
                    '& .rc-slider-handle': {
                        position: 'absolute',
                        marginLeft: -(sliderHeight / 2),
                        width: sliderHeight,
                        height: sliderHeight,
                        backgroundColor: colors.black,
                        cursor: 'grab',
                        borderRadius: '50%',
                        touchAction: 'pan-x',
                        ':active': {
                            boxSizing: 'border-box',
                            cursor: 'grabbing',
                            backgroundColor: colors.white,
                            borderWidth: 2,
                            borderStyle: 'solid',
                            borderColor: colors.black,
                            zIndex: 1
                        }
                    }
                }}
            />
        );
    }
}

export default wrapComponent(Range, 'Range');
