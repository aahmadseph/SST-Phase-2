import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import BccRwdComponentList from 'components/Bcc/BccRwdComponentList/BccRwdComponentList';
import BCCUtils from 'utils/BCC';

const { COMPONENT_NAMES, processTargeters } = BCCUtils;

class BccRwdTargeter extends BaseClass {
    state = {
        compProps: this.props || null
    };

    componentDidMount() {
        let unsubscribers = processTargeters(this.props.targeterName, this.updateComponent.bind(this));
        unsubscribers = (this['__ufe__']?.unsubscribers || []).concat(unsubscribers);
        this['__ufe__'] = {
            ...(this['__ufe__'] || {}),
            unsubscribers
        };
    }

    updateComponent = targeterResult => {
        if (targeterResult.length) {
            try {
                const results = targeterResult.map(result => {
                    const newResult = { ...result };

                    // Pass icid2 to components if source needs it
                    if (this.props.isTrackByName) {
                        newResult.isTrackByName = this.props.isTrackByName;
                    }

                    return newResult;
                });

                this.setState({
                    compProps: results
                });
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error(err);
            }
        }
    };

    render() {
        const { compProps } = this.state;
        const { context, enabledPageRenderTracking } = this.props;

        const isBccComponentExceptTargeter = () => Array.isArray(compProps) || compProps.componentType !== COMPONENT_NAMES.RWD_TARGETER;

        return isBccComponentExceptTargeter() ? (
            <BccRwdComponentList
                items={compProps}
                context={context}
                enabledPageRenderTracking={enabledPageRenderTracking}
            />
        ) : null;
    }
}

export default wrapComponent(BccRwdTargeter, 'BccRwdTargeter', true);
