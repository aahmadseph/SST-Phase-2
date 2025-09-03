import React from 'react';

import BaseClass from 'components/BaseClass';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import ErrorMsg from 'components/ErrorMsg';
import { colors, modal } from 'style/config';
import { Text, Box } from 'components/ui';

const COLOURS = [
    {
        name: 'White',
        hash: 'FFFFFF',
        showBorder: true
    },
    {
        name: 'Black',
        hash: '000000'
    },
    {
        name: 'Gray',
        hash: '888888'
    },
    {
        name: 'Silver',
        hash: 'CCCCCC'
    },
    {
        name: 'Red',
        hash: 'CF112C'
    },
    {
        name: 'Blue',
        hash: '136BEA'
    },
    {
        name: 'Beige',
        hash: 'D6BB8E'
    },
    {
        name: 'Gold',
        hash: 'C4AE3D'
    },
    {
        name: 'Brown',
        hash: '9E5009'
    },
    {
        name: 'Green',
        hash: '008048'
    },
    {
        name: 'Orange',
        hash: 'FF8A01'
    },
    {
        name: 'Purple',
        hash: '7E05DE'
    },
    {
        name: 'Yellow',
        hash: 'FFD703'
    },
    {
        name: 'Pink',
        hash: 'FF89C2'
    }
];

class VehicleColorSelector extends BaseClass {
    state = { error: null };

    validateError = () => {
        const error = this.props.validate ? this.props.validate(this.props.selectedColour) : null;

        this.setState({ error });

        return error;
    };

    render() {
        const { title, selectedColour, onClick } = this.props;
        const { error } = this.state;

        return (
            <Box
                is='fieldset'
                marginBottom={3}
            >
                <Text
                    is='legend'
                    color={error && 'error'}
                >
                    {title} <b>{selectedColour}</b>
                </Text>
                <Box
                    overflowX='auto'
                    marginX={modal.outdentX}
                    paddingX={modal.paddingLg}
                    paddingY={1}
                    fontSize='0px'
                >
                    {COLOURS.map(({ showBorder, ...item }) => (
                        <Box
                            key={item.name}
                            is='label'
                            display='inline-block'
                            position='relative'
                            borderWidth={1}
                            padding='2px'
                            borderRadius='full'
                            borderColor={item.name === selectedColour ? 'black' : 'transparent'}
                            css={{
                                cursor: 'pointer',
                                ':focus-within': {
                                    boxShadow: `${colors.black} 0 0 0 1px`
                                },
                                ':last-child': {
                                    marginRight: '-3px'
                                }
                            }}
                        >
                            <input
                                type='radio'
                                name='vehicle_color'
                                css={{
                                    position: 'absolute',
                                    opacity: 0
                                }}
                                onChange={() => {
                                    this.setState({ error: null });
                                    onClick(item.name);
                                }}
                            />
                            <Box
                                size={36}
                                borderRadius='full'
                                backgroundColor={`#${item.hash}`}
                                borderColor={showBorder && 'midGray'}
                                borderWidth={showBorder && 1}
                            />
                        </Box>
                    ))}
                </Box>
                {error && (
                    <ErrorMsg
                        marginBottom={null}
                        children={error}
                    />
                )}
            </Box>
        );
    }
}

export default wrapComponent(VehicleColorSelector, 'VehicleColorSelector');
