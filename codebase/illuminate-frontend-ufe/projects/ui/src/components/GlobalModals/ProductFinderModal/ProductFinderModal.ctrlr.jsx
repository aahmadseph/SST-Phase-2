import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';

import Actions from 'Actions';
import store from 'Store';
import UI from 'utils/UI';
import { QUIZ } from 'constants/gamification';
import gamificationUtils from 'utils/gamificationUtils';
import productFinderModalBindings from 'analytics/bindingMethods/components/globalModals/productFinderModal/productFinderModalBindings';

import {
    radii, colors, fontSizes, lineHeights, modal, space, breakpoints, mediaQueries
} from 'style/config';
import { Box, Image } from 'components/ui';
import Modal from 'components/Modal/Modal';

const { completeQuizEvent } = gamificationUtils;
const { showProductFinderModal } = Actions;

const AVAILABLE_PRODUCT_FINDER_NAME = {
    SKINCARE_FINDER: 'Skincare Finder',
    SKIN_ROUTINE_BUILDER: 'Skincare Routine Builder'
};

const NAV_HEIGHT = [48, 60];
const ANSWER_MARGIN = space[2];

class ProductFinderModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            questionNumber: 1,
            questionText: ''
        };
    }

    requestClose = isResults => {
        store.dispatch(showProductFinderModal(false));

        // Disconnect questions observer
        if (this.questionsObserver) {
            this.questionsObserver.disconnect();
        }

        if (isResults) {
            const quizResultsValue = `productfinder:${this.props.bccData.name}:n/a:*results`;
            digitalData.page.attributes.sephoraPageInfo.pageName = quizResultsValue;
            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageName: quizResultsValue,
                    pageDetail: this.props.bccData.name,
                    pageType: anaConsts.PAGE_TYPES.PRODUCT_FINDER,
                    previousPageName: `productfinder:start-quiz:${this.props.bccData.name}`
                }
            });
            anaUtils.setNextPageData({ pageName: quizResultsValue });

            if (this.props.bccData.productFinderName === AVAILABLE_PRODUCT_FINDER_NAME.SKIN_ROUTINE_BUILDER) {
                completeQuizEvent(QUIZ.COMPLETE_SKIN_ROUTINE_QUIZ);
            }
        }
    };

    setUpQuestionsDomObserver = () => {
        // Questions DOM wrapper.
        // TODO: SA-1506. Stop accesing DOM directly
        const questionsWrapper = document.getElementById('divQuestionnaireContent');

        if (questionsWrapper) {
            // Observer configuration.
            const observerConfig = {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            };

            this.questionsObserver = UI.observeElement(this.scrollQuestionToTop);

            if (this.questionsObserver) {
                this.questionsObserver.observe(questionsWrapper, observerConfig);
            }
        }
    };

    triggerAnalytics = () => {
        // Get the question text
        const questionNode = document.getElementsByClassName('productfinder-question-title');
        const questionText = questionNode[0]?.textContent;

        // Make sure we don't trigger the same event twice
        if (questionText && questionText !== this.state.questionText) {
            productFinderModalBindings.quizQuestion({
                questionText,
                questionNumber: this.state.questionNumber
            });
            this.setState({ questionText, questionNumber: this.state.questionNumber + 1 });
        }
    };

    scrollQuestionToTop = () => {
        // We need to reset the scroll in this element.
        const scrollableEl = document.getElementById('productFinderModalScrollable');

        this.triggerAnalytics();

        if (scrollableEl) {
            UI.scrollElementToTop(scrollableEl);
        }
    };

    render() {
        const bccData = this.props.bccData;

        return (
            <Modal
                isOpen={true}
                width={4}
                noScroll={true}
                onDismiss={this.requestClose}
            >
                <Modal.Header>
                    <Modal.Title children={bccData.productFinderName} />
                </Modal.Header>
                <Modal.Body
                    paddingX={null}
                    paddingTop={null}
                    paddingBottom={null}
                    height={552}
                    display='flex'
                    flexDirection='column'
                    overflow='hidden'
                >
                    <picture>
                        <source
                            media={breakpoints.xsMax}
                            srcSet={bccData.mobileBackgroundPath}
                        />
                        <Image
                            src={bccData.desktopBackgroundPath}
                            size='100%'
                            css={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                objectFit: 'cover'
                            }}
                        />
                    </picture>
                    <Box
                        id='productFinderModalScrollable'
                        position='relative'
                        overflowY='auto'
                        flex={1}
                        paddingTop={modal.paddingSm}
                        paddingX={modal.paddingX}
                        paddingBottom={[NAV_HEIGHT[0] + space[4], NAV_HEIGHT[1] + space[4]]}
                        textAlign='center'
                        lineHeight='tight'
                        dangerouslySetInnerHTML={{
                            __html: this.state.content
                        }}
                        css={{
                            '& .options': {
                                overflow: 'hidden',
                                margin: -ANSWER_MARGIN,
                                [mediaQueries.sm]: {
                                    margin: `-${ANSWER_MARGIN}px auto`,
                                    maxWidth: '83%'
                                }
                            },
                            '& .certona-pf-input-hidden': {
                                display: 'none'
                            },
                            '& .productfinder-question-title': {
                                fontSize: fontSizes.lg,
                                fontWeight: 'var(--font-weight-bold)',
                                marginBottom: space[4],
                                [mediaQueries.sm]: {
                                    marginBottom: space[6]
                                }
                            },
                            '& .backContainer, & .continueContainer': {
                                right: 0,
                                bottom: 0,
                                position: 'fixed',
                                [mediaQueries.sm]: {
                                    position: 'absolute'
                                }
                            },
                            '& .backContainer': {
                                zIndex: 1,
                                left: 0,
                                backgroundColor: colors.white,
                                boxShadow: '0 -2px 8px 0 rgba(0,0,0,0.10)'
                            },
                            '& .continueContainer': {
                                fontWeight: 'var(--font-weight-bold)',
                                zIndex: 2
                            },
                            '& .insight-submit-btn': {
                                display: 'block',
                                font: 'inherit',
                                height: NAV_HEIGHT[0],
                                border: 0,
                                background: 'none',
                                padding: `0 ${modal.paddingX[0]}px`,
                                fontSize: fontSizes.base,
                                outline: 0,
                                ':hover, :focus': {
                                    textDecoration: 'underline'
                                },
                                ':disabled': {
                                    cursor: 'default',
                                    color: colors.gray,
                                    textDecoration: 'none'
                                },
                                [mediaQueries.sm]: {
                                    padding: `0 ${modal.paddingX[1]}px`,
                                    height: NAV_HEIGHT[1],
                                    fontSize: fontSizes.md
                                }
                            },
                            '& .certona-pf-input-container': {
                                boxSizing: 'border-box',
                                display: 'inline-block',
                                width: `calc(100% - ${ANSWER_MARGIN * 2}px)`,
                                margin: ANSWER_MARGIN,
                                padding: 2,
                                cursor: 'pointer',
                                fontSize: fontSizes.md,
                                backgroundColor: colors.white,
                                boxShadow: '0 0 4px 0 rgba(0,0,0,0.25)',
                                border: '4px solid transparent',
                                borderRadius: radii[2],
                                outline: 0,
                                ':hover': {
                                    textDecoration: 'underline'
                                },
                                ':focus': {
                                    outline: `1px dashed ${colors.black}`,
                                    outlineOffset: space[1]
                                },
                                '&:active, &.selected': {
                                    borderColor: colors.black
                                },
                                [mediaQueries.sm]: {
                                    width: `calc(100% * 1 / 2 - ${ANSWER_MARGIN * 2}px)`,
                                    '&.has-img, &:first-child:nth-last-child(n + 5), &:first-child:nth-last-child(n + 5) ~ *': {
                                        float: 'left'
                                    }
                                }
                            },
                            '& .productfinder-answer-image': {
                                display: 'block',
                                maxWidth: '100%'
                            },
                            '& .productfinder-answer-text': {
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                fontSize: fontSizes.base,
                                lineHeight: lineHeights.tight,
                                height: fontSizes.base * lineHeights.tight * 2 + space[2],
                                paddingLeft: space[3],
                                paddingRight: space[3],
                                '&:empty': {
                                    display: 'none'
                                }
                            },
                            '& .ProgressBar': {
                                backgroundColor: colors.midGray,
                                borderRadius: radii[2],
                                width: '100%',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                marginBottom: space[6],
                                [mediaQueries.sm]: {
                                    width: 334
                                }
                            },
                            '& .ProgressBar-inner': {
                                backgroundColor: colors.black,
                                borderRadius: radii[2],
                                height: 4
                            }
                        }}
                    />
                </Modal.Body>
            </Modal>
        );
    }
}

export default wrapComponent(ProductFinderModal, 'ProductFinderModal', true);
