/* eslint-disable camelcase */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import PropTypes from 'prop-types';
import { Box, Image } from 'components/ui';
import { colors, radii, fontSizes } from 'style/config';
import RatingScale from 'ai/components/SuperChat/FeedbackCollection/RatingScale/RatingScale';
import CommentsStep from 'ai/components/SuperChat/FeedbackCollection/CommentsStep/CommentsStep';
import genAISocketService from 'ai/services/socket/socketService';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';

class FeedbackCollection extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            currentStep: 0,
            comments: '',
            showCheckmark: false,
            isSubmitting: false,
            isVisible: true
        };

        // Initialize responses array based on the number of prompts
        this.responses = new Array(this.props.feedbackSteps?.length || 0).fill(null);
    }

    handleRatingClick = rating => {
        const { currentStep } = this.state;
        const { submitFeedback, sessionId, clientId, anonymousId } = this.props;
        const currentPrompt = this.props.feedbackSteps?.[currentStep];

        // Store response in the responses array
        this.responses[currentStep] = rating;

        submitFeedback({
            question: currentPrompt.question,
            response: rating.toString(),
            sessionId,
            lastMessageId: genAISocketService.lastMessageId,
            clientId,
            anonymousId
        });
        this.showCheckmarkAndProceed();
    };

    handleCommentsChange = value => {
        this.setState({ comments: value });
        // Update response in real-time for textbox inputs
        this.responses[this.state.currentStep] = value;
    };

    handleSubmitComments = response => {
        // Store the final comments response
        this.responses[this.state.currentStep] = response;

        const { submitFeedback, sessionId, clientId, anonymousId } = this.props;
        const currentPrompt = this.props.feedbackSteps?.[this.state.currentStep];

        submitFeedback({
            question: currentPrompt.question,
            response: response.toString(),
            sessionId,
            lastMessageId: genAISocketService.lastMessageId,
            clientId,
            anonymousId
        });

        this.showCheckmarkAndProceed();
    };

    handleSkipComments = () => {
        // Store empty response for skipped comments
        this.responses[this.state.currentStep] = '';
        this.showCheckmarkAndProceed();
    };

    sendAnalyticsFeedback = currentStepNumber => {
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: `${anaConsts.SUPER_CHAT.SUPERCHAT_FEEDBACK} ${currentStepNumber}:*`
            }
        });
    };

    showCheckmarkAndProceed = () => {
        this.setState({ showCheckmark: true });

        setTimeout(() => {
            const nextStep = this.state.currentStep + 1;

            this.sendAnalyticsFeedback(nextStep + 1);
            this.setState(
                {
                    showCheckmark: false,
                    currentStep: nextStep
                },
                () => {
                    // Check if we've completed all steps
                    if (this.state.currentStep === this.props.feedbackSteps?.length) {
                        this.submitFeedback();
                    }
                }
            );
        }, 500);
    };

    submitFeedback = () => {
        this.setState({ isSubmitting: true });

        try {
            // Advance to thank you step (beyond the last feedback step)
            this.setState({
                currentStep: this.props.feedbackSteps?.length,
                isSubmitting: false
            });

            // Hide component after showing thank you message for 2 seconds
            setTimeout(() => {
                this.setState({ isVisible: false });

                if (this.props.onClose) {
                    this.props.onClose();
                }
            }, 2000);
        } catch (error) {
            // Handle error state if needed
            if (this.props.onError) {
                this.props.onError(error);
            }
        } finally {
            this.setState({ isSubmitting: false });
        }
    };

    renderCurrentStep = () => {
        const { currentStep } = this.state;
        const currentPrompt = this.props.feedbackSteps?.[currentStep];

        if (!currentPrompt) {
            return null;
        }

        switch (currentPrompt.component.type) {
            case 'radio':
                return this.renderRatingScale();
            case 'textbox':
                return this.renderCommentsStep();
            default:
                return null;
        }
    };

    renderRatingScale = () => {
        const { currentStep, showCheckmark } = this.state;
        const currentPrompt = this.props.feedbackSteps?.[currentStep];
        const selectedRating = this.responses[currentStep];

        return (
            <RatingScale
                question={currentPrompt.question}
                scaleLabel={{
                    min: currentPrompt.component.min_alt_text,
                    max: currentPrompt.component.max_alt_text
                }}
                options={currentPrompt.component.options}
                selectedRating={selectedRating}
                disabled={showCheckmark}
                onRatingSelect={this.handleRatingClick}
            />
        );
    };

    renderCommentsStep = () => {
        const { comments, showCheckmark, currentStep } = this.state;
        const currentPrompt = this.props.feedbackSteps?.[currentStep];

        return (
            <CommentsStep
                question={currentPrompt.question}
                comments={comments}
                placeholder={currentPrompt.component.placeholder}
                submitText={currentPrompt.component.submit_text}
                disabled={showCheckmark}
                onCommentsChange={this.handleCommentsChange}
                onSubmit={this.handleSubmitComments}
                currentStep={currentStep} // for Analytics
            />
        );
    };

    renderThankYou = () => {
        const { localization } = this.props;

        return (
            <Box css={styles.thankYouContainer}>
                <span style={styles.thankYouMessage}>{localization.thanksMessage}</span>
                <button onClick={this.handleThankYouCloseClick}>
                    <Image
                        src='/img/ufe/x-button.svg'
                        alt={localization.close}
                        width={10.5}
                        height={10.5}
                    />
                </button>
            </Box>
        );
    };

    // CSS animation for checkmark
    componentDidMount() {
        this.sendAnalyticsFeedback(1); // call analytics when feedback opens

        // Inject CSS animation for checkmark pulse effect
        const style = document.createElement('style');
        style.textContent = `
            @keyframes checkmarkPulse {
                0% {
                    transform: scale(0.8);
                    opacity: 0;
                }
                50% {
                    transform: scale(1.1);
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        this.styleElement = style;
    }

    componentWillUnmount() {
        // Clean up the injected style when component unmounts
        if (this.styleElement) {
            document.head.removeChild(this.styleElement);
        }
    }

    shouldShowHeaderCheckmark = () => {
        const { currentStep, showCheckmark } = this.state;
        const currentPrompt = this.props.feedbackSteps?.[currentStep];

        if (!currentPrompt) {
            return false;
        }

        // Show checkmark when current step has a response (and during the showCheckmark animation)
        if (currentPrompt.component.type === 'radio') {
            return this.responses[currentStep] !== null || showCheckmark;
        }

        if (currentPrompt.component.type === 'textbox') {
            // For comments step, show checkmark only during the transition (showCheckmark = true)
            return showCheckmark;
        }

        return false;
    };

    handleCloseButtonClick = () => {
        const { showCheckmark, currentStep } = this.state;

        if (showCheckmark) {
            return;
        }

        // For first and second steps (0 and 1), immediately close the feedback module
        if (currentStep < 2) {
            this.setState({ isVisible: false });

            if (this.props.onClose) {
                this.props.onClose();
            }

            return;
        }

        // For third step (optional step), show checkmark first, then go to thank you component
        this.setState({ showCheckmark: true });

        setTimeout(() => {
            this.setState({
                showCheckmark: false,
                currentStep: this.props.feedbackSteps?.length || 0
            });
        }, 500);
    };

    handleThankYouCloseClick = () => {
        this.setState({ isVisible: false });

        if (this.props.onClose) {
            this.props.onClose();
        }
    };

    render() {
        const { currentStep, showCheckmark, isVisible } = this.state;

        // Don't render anything if component is not visible
        if (!isVisible) {
            return null;
        }

        // Show thank you message as standalone component when all steps are completed
        if (currentStep === this.props.feedbackSteps?.length) {
            return this.renderThankYou();
        }

        return (
            <Box css={styles.container}>
                <Box css={styles.header}>
                    <Box css={styles.headerTitleContainer}>
                        <span style={styles.headerTitle}>{this.props.feedbackSteps?.[currentStep]?.title}</span>
                        <span
                            style={{
                                ...styles.headerCheckmark,
                                visibility: this.shouldShowHeaderCheckmark() ? 'visible' : 'hidden'
                            }}
                        >
                            <Image
                                width={14}
                                height={14}
                                src='/img/ufe/checkmark.svg'
                                css={styles.checkmarkImg}
                            />
                        </span>
                    </Box>
                    <button
                        onClick={this.handleCloseButtonClick}
                        disabled={showCheckmark}
                        style={styles.closeButton}
                    >
                        <Image
                            src='/img/ufe/x-button.svg'
                            alt='close'
                            width={10.5}
                            height={10.5}
                        />
                    </button>
                </Box>

                <Box css={styles.content}>{this.renderCurrentStep()}</Box>
            </Box>
        );
    }
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        padding: 12,
        width: '100%',
        background: colors.nearWhite,
        borderRadius: radii[4] + radii[2]
    },
    header: {
        display: 'flex',
        alignSelf: 'stretch',
        justifyContent: 'space-between'
    },
    headerTitleContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    headerTitle: {
        fontSize: fontSizes.xs,
        color: colors.gray
    },
    headerCheckmark: {
        marginLeft: 4
    },
    checkmarkImg: {
        verticalAlign: 'sub'
    },
    closeButton: {
        width: 13,
        cursor: 'pointer'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '0px',
        gap: 8,
        height: 'auto',
        order: 0,
        alignSelf: 'stretch',
        flexGrow: 0,
        zIndex: 0
    },
    thankYouContainer: {
        backgroundColor: colors.nearWhite,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        borderRadius: '12px',
        margin: '16px 0',
        width: '100%'
    },
    thankYouMessage: {
        fontSize: fontSizes.sm,
        color: colors.black
    }
};

FeedbackCollection.propTypes = {
    submitFeedback: PropTypes.func,
    onError: PropTypes.func,
    onClose: PropTypes.func,
    sessionId: PropTypes.string,
    localization: PropTypes.object,
    feedbackSteps: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            question: PropTypes.string,
            component: PropTypes.shape({
                type: PropTypes.oneOf(['radio', 'textbox']),
                options: PropTypes.array,
                min_alt_text: PropTypes.string,
                max_alt_text: PropTypes.string,
                placeholder: PropTypes.string,
                submit_text: PropTypes.string
            })
        })
    )
};

FeedbackCollection.defaultProps = {
    submitFeedback: () => {},
    onError: () => {},
    onClose: () => {},
    sessionId: '',
    localization: {},
    feedbackSteps: []
};

export default wrapComponent(FeedbackCollection, 'FeedbackCollection');
