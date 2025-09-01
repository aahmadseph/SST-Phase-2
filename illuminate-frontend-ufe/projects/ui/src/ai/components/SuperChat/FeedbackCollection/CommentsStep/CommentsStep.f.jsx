import React from 'react';
import PropTypes from 'prop-types';
import { Box } from 'components/ui';
import { space, fontSizes } from 'style/config';
import Button from 'components/Button';
import Markdown from 'components/Markdown/Markdown';
import Textarea from 'components/Inputs/Textarea/Textarea';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('ai/components/SuperChat/FeedbackCollection/locales', 'FeedbackCollection');

import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';

const CommentsStep = ({
    question, comments, placeholder, submitText, disabled, onCommentsChange, currentStep, onSubmit
}) => {
    const sendAnalyticsSubmit = currentStepNumber => {
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                actionInfo: `${anaConsts.SUPER_CHAT.SUPERCHAT_FEEDBACK_SUBMITTED}`, // prop55
                pageName: `${anaConsts.SUPER_CHAT.SUPERCHAT_FEEDBACK} ${currentStepNumber}:*`
            }
        });
    };

    const handleCommentsChange = value => {
        if (onCommentsChange) {
            onCommentsChange(value);
        }
    };

    const handleSubmit = () => {
        if (onSubmit) {
            sendAnalyticsSubmit(currentStep + 1);
            onSubmit(comments);
        }
    };

    return (
        <Box css={styles.commentsContainer}>
            <Box css={styles.question}>
                <Markdown content={question} />
            </Box>

            <Textarea
                placeholder={placeholder}
                value={comments}
                handleChange={handleCommentsChange}
                disabled={disabled}
                isSMPadding={true}
                maxLength={250}
                hideCharacterCount
                rows={2}
                customStyle={styles.commentBox}
            />

            <Box css={styles.commentsActions}>
                <Button
                    variant='primary'
                    size='sm'
                    onClick={handleSubmit}
                    disabled={disabled}
                    css={styles.button}
                >
                    {submitText}
                </Button>
            </Box>
        </Box>
    );
};

const styles = {
    commentsContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: space[1],
        alignSelf: 'stretch'
    },
    question: {
        width: 291,
        fontSize: fontSizes.sm,
        lineHeight: '14px',
        marginBottom: space[2]
    },
    commentsActions: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '100%',
        justifyContent: 'flex-end'
    },
    commentBox: {
        root: {
            width: '100%'
        },
        input: {
            height: 98,
            fontSize: 12
        }
    },
    button: {
        fontSize: fontSizes.xs
    }
};

CommentsStep.propTypes = {
    question: PropTypes.string.isRequired,
    comments: PropTypes.string,
    placeholder: PropTypes.string,
    submitText: PropTypes.string,
    disabled: PropTypes.bool,
    onCommentsChange: PropTypes.func,
    onSubmit: PropTypes.func
};

CommentsStep.defaultProps = {
    comments: '',
    placeholder: '',
    submitText: getText('submit'),
    disabled: false,
    onCommentsChange: () => {},
    onSubmit: () => {}
};

export default CommentsStep;
