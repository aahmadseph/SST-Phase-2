/* eslint-disable ssr-friendly/no-dom-globals-in-react-cc-render */
import React from 'react';
import ReactDOM from 'react-dom';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Button, Text, Link, Divider, Image
} from 'components/ui';
import Chevron from 'components/Chevron';
import { breakpoints } from 'style/config';
import { DebouncedResize } from 'constants/events';
import CookieUtils from 'utils/Cookies';
import Location from 'utils/Location';
import localeUtils from 'utils/LanguageLocale';

const getText = localeUtils.getLocaleResourceFile('components/PersonalizedPreviewPlacements/SidModalDropdown/locales', 'SidModalDropdown');

class SidModalDropdown extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            showSidList: false,
            bottom: '',
            bottomModal: '',
            shouldSeePreview: false
        };
        this.modalRef = React.createRef();
    }

    componentDidMount() {
        const shouldSeePreview =
            (Location.isOrderConfirmationPage() || (!Location.isCheckout() && !Location.isPreview())) &&
            CookieUtils.read(CookieUtils.KEYS.IS_PREVIEW_ENV_COOKIE) &&
            Location.isHomepage() &&
            Sephora?.configurationSettings?.isPreviewPersonalizationEnabled;
        this.setState({
            shouldSeePreview
        });
        this.handleResize();
        window.addEventListener(DebouncedResize, this.handleResize);
        window.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.handleResize);
        window.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleResize = () => {
        const values = this.getBottomValue();
        this.setState({ bottom: values.container, bottomModal: values.modal });
    };

    handleClickOutside = event => {
        if (this.modalRef.current && !this.modalRef.current.contains(event.target)) {
            this.setState({ showSidList: false });
        }
    };

    handleShowListChange = () => {
        this.setState({ showSidList: !this.state.showSidList });
    };

    getBottomValue = () => {
        let response = {};

        switch (true) {
            case window.matchMedia(breakpoints.xsMax).matches:
                response = { container: ['calc(var(--bottomNavHeight) + 108px)', null, 0], modal: 67 };

                return response;
            case window.matchMedia(breakpoints.smMax).matches:
                response = { container: ['calc(var(--bottomNavHeight) + 108px)'] + '!important', modal: 87 };

                return response;
            case window.matchMedia(breakpoints.mdMax).matches:
                response = { container: ['calc(var(--bottomNavHeight) + 22px)'] + '!important', modal: 10 };

                return response;
            default:
                response = { container: ['calc(var(--bottomNavHeight) + 22px)'] + '!important', modal: 10 };

                return response;
        }
    };

    renderModal = () => {
        return (
            <>
                <Box
                    zIndex='fixedBar'
                    bottom={this.state.bottom}
                    left={0}
                    padding={2}
                    marginRight={1}
                    css={styles.mainContainer}
                    onClick={this.handleShowListChange}
                    data-at={Sephora.debug.dataAt('sid-modal-dropdown')}
                >
                    <Text
                        fontSize='md'
                        fontWeight='bold'
                        children={getText('personalizedPlacements')}
                    />
                    <Chevron
                        direction='right'
                        cursor='pointer'
                    />
                </Box>
                {this.state?.showSidList && (
                    <Box
                        css={styles.mainBoxList}
                        left={window.matchMedia('(max-width: 992px)').matches ? '0' : '275px'}
                        zIndex='header'
                        bottom={this.state.bottomModal}
                        data-at={Sephora.debug.dataAt('sid-list')}
                        ref={this.modalRef}
                    >
                        <Divider css={styles.modalDivider} />
                        <Box
                            css={styles.boxList}
                            zIndex='header'
                        >
                            <Text
                                fontSize='md'
                                fontWeight='bold'
                                css={styles.modalListTitle}
                                children={getText('personalizedPlacements')}
                            />
                            <ul css={{ width: window.innerWidth < 993 ? window.innerWidth - 32 : '375px', position: 'relative' }}>
                                {this.props?.p13n?.sid &&
                                    this.props?.p13n?.sid.map(item => (
                                        <li key={item}>
                                            <Link
                                                key={item}
                                                children={item}
                                                marginBottom={1}
                                                padding={2}
                                                style={{ overflowWrap: 'anywhere' }}
                                                onClick={() => {
                                                    this.handleShowListChange();
                                                    document.getElementById(item).scrollIntoView({
                                                        behavior: 'smooth'
                                                    });
                                                }}
                                            />
                                        </li>
                                    ))}
                            </ul>
                            <Button
                                onClick={this.handleShowListChange}
                                css={styles.closeButton}
                            >
                                <Image
                                    src='/img/ufe/x-button.svg'
                                    alt='close'
                                />
                            </Button>
                        </Box>
                    </Box>
                )}
            </>
        );
    };
    render() {
        if (!this.state.shouldSeePreview) {
            return null;
        }

        return <div>{ReactDOM.createPortal(this.renderModal(), document.querySelector('body'))}</div>;
    }
}

const styles = {
    closeButton: {
        position: 'absolute',
        top: '0px',
        right: '10px',
        minWidth: 'fit-content',
        minHeight: 'auto',
        border: 'none',
        padding: 0,
        paddingTop: '5px'
    },
    mainBoxList: {
        backgroundColor: '#ffffff',
        padding: '15px 16px',
        position: 'fixed',
        boxShadow: '0px 0px 12px 0px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden'
    },
    boxList: {
        position: 'relative'
    },
    modalListTitle: {
        display: 'block',
        width: '100%',
        textAlign: 'center',
        marginBottom: '30px'
    },
    mainContainer: {
        width: '270px',
        height: '44px',
        backgroundColor: '#06E3FF',
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer'
    },
    modalDivider: {
        width: '100%',
        position: 'absolute',
        left: 0,
        top: '50px'
    }
};

export default wrapComponent(SidModalDropdown, 'SidModalDropdown');
