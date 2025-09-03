import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import BCCUtils from 'utils/BCC';

const { COMPONENT_NAMES, processTargeters } = BCCUtils;

class BccTargeter extends BaseClass {
    state = {
        compProps: this.props || null,
        propsCallback: this.props.propsCallback || null
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
                this.checkBccSetup(targeterResult);

                const results = targeterResult.map(result => {
                    const newResult = { ...result };

                    // Pass icid2 to components if source needs it
                    if (this.props.isTrackByName) {
                        newResult.isTrackByName = this.props.isTrackByName;
                    }

                    // Pass propsCallback to components if source needs it
                    if (this.props.propsCallback !== 'undefined') {
                        newResult.propsCallback = this.props.propsCallback;
                    }

                    return newResult;
                });

                this.setState({ compProps: results });
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error(err);
            }
        }
    };

    checkBccSetup = targeterResult => {
        if (targeterResult.length > 1 && this.props.isTopBanner) {
            throw 'Invalid BccTargeter configuration: Persistent Banner can not render multiple components';
        }
    };

    render() {
        const { compProps } = this.state;
        const isBccComponentExceptTargeter = () => Array.isArray(compProps) || compProps.componentType !== COMPONENT_NAMES.TARGETER;

        return isBccComponentExceptTargeter() ? (
            <BccComponentList
                items={compProps}
                propsCallback={this.state.propsCallback}
                isContained={compProps.isContained}
                enabledPageRenderTracking={this.props.enabledPageRenderTracking}
            />
        ) : null;
    }
}

export default wrapComponent(BccTargeter, 'BccTargeter', true);
