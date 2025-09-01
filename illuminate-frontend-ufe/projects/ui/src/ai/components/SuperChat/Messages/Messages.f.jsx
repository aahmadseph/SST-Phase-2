import React, { useRef, useEffect } from 'react';
import FrameworkUtils from 'utils/framework';
import Message from 'ai/components/SuperChat/Messages/Message/Message';
import { Flex } from 'components/ui';
import ContextualChips from 'ai/components/SuperChat/ContextualChips/ContextualChips';
import FeedbackCollection from 'ai/components/SuperChat/FeedbackCollection';
import LoadingDots from 'ai/components/SuperChat/LoadingDots/LoadingDots';
import { RESPONSE_TYPES } from 'ai/constants/superchat';
import ProductRecommendation from 'ai/components/SuperChat/ProductRecommendation';

const { wrapFunctionalComponent } = FrameworkUtils;

function Messages(props) {
    const {
        messages,
        sendMessage,
        hiddenContextualChips,
        onContextualChipClick,
        latestContextualChipIndex,
        isLoading,
        isPrevious = false,
        showFeedbackInMessages = false,
        feedbackSteps,
        sessionId,
        submitFeedback,
        onCloseFeedback
    } = props;

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (isPrevious) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
        } else {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!messages.length && !isLoading) {
        return null;
    }

    return (
        <Flex
            gap={5}
            flexDirection='column'
            width='100%'
        >
            {messages.map((message, index) => {
                if (message.response_type === RESPONSE_TYPES.FOLLOW_UP_MESSAGES_RESPONSE) {
                    if (index !== latestContextualChipIndex || (hiddenContextualChips && hiddenContextualChips.has(index))) {
                        return null;
                    }

                    return (
                        <ContextualChips
                            key={message?.data?.follow_ups?.id}
                            chips={message?.data?.follow_ups}
                            sendMessage={sendMessage}
                            onChipClick={chip => onContextualChipClick(index, chip)}
                        />
                    );
                }

                if (message.response_type === RESPONSE_TYPES.PRODUCT_RECOMMENDATION_RESPONSE) {
                    return (
                        <ProductRecommendation
                            key={index}
                            products={message?.data?.products || []}
                        />
                    );
                }

                return (
                    <Message
                        key={index}
                        message={message}
                    />
                );
            })}

            {/* Show FeedbackCollection when requested from flyer */}
            {showFeedbackInMessages && !isPrevious && (
                <FeedbackCollection
                    feedbackSteps={feedbackSteps}
                    sessionId={sessionId}
                    submitFeedback={submitFeedback}
                    onClose={onCloseFeedback}
                />
            )}

            {/* Show loading dots when waiting for response */}
            {isLoading && <LoadingDots />}

            <div ref={messagesEndRef} />
        </Flex>
    );
}

// const styles = {};

export default wrapFunctionalComponent(Messages, 'Messages');
