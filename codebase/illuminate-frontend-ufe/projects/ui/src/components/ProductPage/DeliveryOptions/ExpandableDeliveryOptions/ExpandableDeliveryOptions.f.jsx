import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Box, Grid, Text, Icon, Link
} from 'components/ui';
import Markdown from 'components/Markdown/Markdown';
import {
    mediaQueries, radii, space, fontSizes, colors
} from 'style/config';
import basketConstants from 'constants/Basket';
import userUtils from 'utils/User';
import helpersUtils from 'utils/Helpers';
import { HEADER_VALUE } from 'constants/authentication';
import Empty from 'constants/empty';

const ICON_SIZE = 24;
const BORDER_RADIUS = 2;
const BORDER_WIDTH = 1;
const TRANSITION = 'opacity .2s';

const { DELIVERY_OPTIONS } = basketConstants;
const { replaceDoubleAsterisks } = helpersUtils;

const ExpandableDeliveryOptions = ({
    id,
    header,
    smHeader,
    subHeader,
    smSubHeader,
    enableMarkdownSubtitle,
    children,
    selected,
    iconName,
    handleChange,
    disabled,
    showBopisSelectorCopyOnPdp,
    hasPickupMessage,
    signInText,
    forFreeShippingText,
    deliveryOption,
    showSignInModal,
    fromChooseOptionsModal
}) => {
    const borderColor = !selected ? 'midGray' : null;

    const showGetItShippedSignInLink = deliveryOption === DELIVERY_OPTIONS.STANDARD && userUtils.isAnonymous();

    const renderHeaderText = (content, cssStyle = null) => (
        <Text
            className='header'
            fontWeight='bold'
            display='block'
            color={disabled ? 'gray' : null}
            children={content}
            css={cssStyle}
        />
    );

    const renderHeader = () => {
        if (showGetItShippedSignInLink) {
            return null;
        }

        if (fromChooseOptionsModal && deliveryOption === DELIVERY_OPTIONS.STANDARD) {
            return (
                <>
                    {renderHeaderText(smHeader, styles.smHeader)}
                    {renderHeaderText(header, styles.lgHeader)}
                </>
            );
        }

        return renderHeaderText(header);
    };

    const renderSubHeaderText = (content, cssStyle = null) => (
        <Box>
            <Text
                marginTop={[1, 0]}
                fontSize='sm'
                display='block'
                color={disabled ? 'gray' : null}
                css={cssStyle}
                {...(showBopisSelectorCopyOnPdp && hasPickupMessage && selected && { color: colors.green })}
            >
                {enableMarkdownSubtitle ? (
                    <Markdown
                        is='span'
                        css={styles.subHeaderMarkdown}
                        content={replaceDoubleAsterisks(content)}
                    />
                ) : (
                    content
                )}
            </Text>
        </Box>
    );

    const renderSubHeader = () => {
        if (fromChooseOptionsModal && deliveryOption === DELIVERY_OPTIONS.SAME_DAY) {
            return (
                <>
                    {renderSubHeaderText(subHeader, styles.lgSubHeader)}
                    {renderSubHeaderText(subHeader || smSubHeader, styles.smSubHeader)}
                </>
            );
        }

        if (!subHeader) {
            return null;
        }

        return renderSubHeaderText(subHeader);
    };

    const linkRef = createRef();

    const handleBoxClick = e => {
        if (linkRef.current && linkRef.current.contains(e.target)) {
            showSignInModal({ isOpen: true, extraParams: { headerValue: HEADER_VALUE.USER_CLICK } });
        }
    };

    return (
        <Box
            display={[null, 'contents']}
            borderRadius={BORDER_RADIUS}
            borderWidth={BORDER_WIDTH}
            borderColor={borderColor}
            position='relative'
        >
            <Grid
                is='label'
                aria-controls={id}
                aria-expanded={selected}
                columns={['auto 1fr', 1]}
                gridTemplateRows={[null, 'auto 1fr']}
                alignItems={['center', 'start']}
                gap={[3, 1]}
                paddingY={[2, '.7em']}
                paddingX={[3, '.7em']}
                borderRadius={[null, BORDER_RADIUS]}
                borderWidth={[null, BORDER_WIDTH]}
                borderColor={[null, borderColor]}
                backgroundColor={disabled ? 'lightGray' : null}
                onClick={handleBoxClick}
                css={[styles.label, selected ? styles.labelActive : disabled ? null : styles.labelInactive]}
            >
                <Icon
                    name={`${iconName}${selected ? 'Active' : ''}`}
                    size={ICON_SIZE}
                    css={[{ transition: TRANSITION }, !selected && { opacity: 0.4 }]}
                />
                <div css={fromChooseOptionsModal ? styles.deliveryOptionsDivFulfillment : styles.deliveryOptionsDiv}>
                    {showGetItShippedSignInLink && (
                        <Box>
                            <Link
                                ref={linkRef}
                                color='blue'
                                underline={true}
                                children={signInText}
                            />{' '}
                            <Text
                                fontWeight='bold'
                                children={forFreeShippingText}
                            />
                        </Box>
                    )}
                    {renderHeader()}
                    {renderSubHeader()}
                    <input
                        type='radio'
                        checked={selected}
                        onChange={handleChange}
                        css={{ position: 'absolute', opacity: 0 }}
                    />
                </div>
            </Grid>
            <Box
                id={id}
                backgroundColor='nearWhite'
                borderRadius={[null, 2]}
                paddingLeft={[ICON_SIZE + space[3] * 2, 3]}
                paddingRight={3}
                paddingY={3}
                order={1}
                css={styles.smallVersion}
                style={!selected ? { display: 'none' } : null}
                children={children}
            />
        </Box>
    );
};

const styles = {
    subHeaderMarkdown: {
        '& > :first-child': {
            display: 'inline'
        }
    },

    label: {
        [mediaQueries.sm]: {
            position: 'relative'
        },
        '&::before': {
            content: '""',
            position: 'absolute',
            border: '2px solid',
            inset: -BORDER_WIDTH,
            borderRadius: radii[BORDER_RADIUS],
            opacity: 0,
            transition: TRANSITION,
            zIndex: 1,
            pointerEvents: 'none'
        }
    },
    labelActive: {
        '&::before': {
            opacity: 1
        }
    },
    labelInactive: {
        cursor: 'pointer',
        '.no-touch &:hover': {
            '& svg': {
                opacity: 1
            },
            '& .header': {
                textDecoration: 'underline'
            }
        }
    },
    smallVersion: {
        gridColumn: '1 / -1',
        position: 'relative',
        p: {
            fontSize: fontSizes.base
        }
    },
    deliveryOptionsDiv: {
        [mediaQueries.md]: { minHeight: '50px' }
    },
    deliveryOptionsDivFulfillment: {
        [mediaQueries.md]: { minHeight: `${space[6]}px` }
    },
    smHeader: {
        [mediaQueries.sm]: { display: 'none' }
    },
    lgHeader: {
        display: 'none',
        [mediaQueries.sm]: { display: 'block' }
    },
    smSubHeader: {
        [mediaQueries.sm]: { display: 'none' }
    },
    lgSubHeader: {
        display: 'none',
        [mediaQueries.sm]: { display: 'block' }
    }
};

ExpandableDeliveryOptions.propTypes = {
    id: PropTypes.string.isRequired,
    header: PropTypes.string.isRequired,
    smHeader: PropTypes.string,
    subHeader: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    handleChange: PropTypes.func.isRequired,
    iconName: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    fromChooseOptionsModal: PropTypes.bool,
    pickupIndicators: PropTypes.object
};

ExpandableDeliveryOptions.defaultProps = {
    subHeader: null,
    smHeader: null,
    fromChooseOptionsModal: false,
    pickupIndicator: Empty.Object
};

export default wrapFunctionalComponent(ExpandableDeliveryOptions, 'ExpandableDeliveryOptions');
