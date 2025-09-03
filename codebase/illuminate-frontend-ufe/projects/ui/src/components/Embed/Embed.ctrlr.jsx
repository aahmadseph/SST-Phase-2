import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

class Embed extends BaseClass {
    render() {
        const { ratio, children, ...props } = this.props;

        const childProps = {
            style: {
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                bottom: 0,
                left: 0,
                border: 0
            }
        };

        const styledChildren = React.Children.map(children, (child, index) =>
            React.cloneElement(child, Object.assign({}, childProps, { key: index }))
        );

        return (
            <div
                children={styledChildren}
                css={{
                    position: 'relative',
                    height: 0,
                    overflow: 'hidden',
                    paddingBottom: `${(ratio ? ratio : 1) * 100}%`
                }}
                {...props}
            />
        );
    }
}

export default wrapComponent(Embed, 'Embed');
