import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import { Box, Button, Link } from 'components/ui';
import Modal from 'components/Modal/Modal';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';

class KillSwitchUrlToggle extends BaseClass {
    state = {
        showKillswitchModal: false,
        killswitchQueryParamValues: {}
    };

    componentDidMount() {
        this.setState({
            killswitchQueryParamValues: this.getInitialKillSwitchQueryParamValues()
        });
    }

    getInitialKillSwitchQueryParamValues = () => {
        const killswitches = Object.entries(Sephora.configurationSettings).filter(entry => typeof entry[1] === 'boolean');
        const queryParams = new URLSearchParams(global.window.location.search);
        const setConfigValueParam = queryParams.get('setConfigValue');
        const killswitchesInUrl = new Map(setConfigValueParam?.split('|').map(pair => pair?.split(':')));
        const initKillswitchQueryParamValues = killswitches.reduce((acc, [killswitchName, bool]) => {
            const isInUrl = killswitchesInUrl.has(killswitchName);
            acc[killswitchName] = {
                bool: isInUrl ? JSON.parse(killswitchesInUrl.get(killswitchName)) : bool,
                isInUrl
            };

            return acc;
        }, {});

        return initKillswitchQueryParamValues;
    };

    setKillSwitchQueryParam = () => {
        const url = new URL(global.window?.location);

        if (this.state.killswitchQueryParamValues) {
            const serializedKillswitchQueryParam = Object.entries(this.state.killswitchQueryParamValues).reduce(
                (acc, [killswitch, { bool, isInUrl }]) => {
                    if (!isInUrl) {
                        return acc;
                    }

                    const serializedKillswitch = `${killswitch}:${bool}`;

                    if (acc === '') {
                        return serializedKillswitch;
                    }

                    return `${acc}|${serializedKillswitch}`;
                },
                ''
            );

            if (serializedKillswitchQueryParam === '') {
                url.searchParams.delete('setConfigValue');
            } else {
                url.searchParams.set('setConfigValue', serializedKillswitchQueryParam);
            }
        }

        history.replaceState({}, null, decodeURIComponent(url.toString()));
    };

    render() {
        const { getText } = this.props;

        return (
            <>
                <Box marginY={4}>
                    <Link
                        name='toggleKillswitches'
                        onClick={() => {
                            this.setKillSwitchQueryParam();
                            this.setState({
                                showKillswitchModal: true
                            });
                        }}
                    >
                        {getText('toggleKillswitches')}
                    </Link>
                </Box>
                <Modal
                    width={0}
                    onDismiss={() =>
                        this.setState({
                            showKillswitchModal: false
                        })
                    }
                    isOpen={this.state.showKillswitchModal}
                    isHidden={!this.state.showKillswitchModal}
                    isDrawer={true}
                >
                    <Modal.Header>
                        <Modal.Title children={getText('toggleKillswitches')} />
                    </Modal.Header>
                    <Modal.Body
                        paddingBottom={3}
                        maxHeight={600}
                    >
                        {Object.entries(this.state.killswitchQueryParamValues).map(([killswitchName, { bool, isInUrl }]) => {
                            const newEntry = {
                                [killswitchName]: {
                                    bool: !bool,
                                    isInUrl: !isInUrl
                                }
                            };

                            return (
                                <>
                                    <Checkbox
                                        checked={bool}
                                        color={isInUrl ? 'green' : 'black'}
                                        fontWeight={isInUrl ? 'bold' : 'normal'}
                                        onClick={() => {
                                            this.setState(
                                                {
                                                    killswitchQueryParamValues: {
                                                        ...this.state.killswitchQueryParamValues,
                                                        ...newEntry
                                                    }
                                                },
                                                () => this.setKillSwitchQueryParam()
                                            );
                                        }}
                                    >
                                        {killswitchName}
                                    </Checkbox>
                                </>
                            );
                        })}
                    </Modal.Body>
                    <Modal.Footer hasBorder={true}>
                        <Button
                            variant='primary'
                            onClick={() =>
                                this.setState({
                                    showKillswitchModal: false
                                })
                            }
                            block={true}
                            children={getText('confirm')}
                        />
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default wrapComponent(KillSwitchUrlToggle, 'KillSwitchUrlToggle', true);
