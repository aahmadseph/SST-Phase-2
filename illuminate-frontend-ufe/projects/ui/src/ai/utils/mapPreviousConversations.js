/* eslint-disable camelcase */
import { MESSAGE_TYPES } from 'ai/constants/superchat';

function mapPreviousConversations(conversations) {
    if (!conversations || !conversations.messages || conversations.messages.length === 0) {
        return [];
    }

    const { messages } = conversations;

    return messages
        .flatMap(conv => {
            if (conv.role === 'user') {
                return {
                    response_type: MESSAGE_TYPES.USER_QUERY,
                    data: {
                        query: conv.content
                    }
                };
            }

            if (conv.role === 'assistant' && conv.products && conv.products.length > 0) {
                if (conv.content) {
                    return [
                        {
                            response_type: MESSAGE_TYPES.PRODUCTS_RESPONSE,
                            data: {
                                products: conv.products
                            }
                        },
                        {
                            response_type: MESSAGE_TYPES.USER_QUERY_RESPONSE,
                            data: {
                                stream: false,
                                summary: conv.content
                            }
                        }
                    ];
                }

                return {
                    response_type: MESSAGE_TYPES.PRODUCTS_RESPONSE,
                    data: {
                        products: conv.products
                    }
                };
            }

            return {
                response_type: MESSAGE_TYPES.USER_QUERY_RESPONSE,
                data: {
                    stream: false,
                    summary: conv.content
                }
            };
        })
        .reverse();
}

export default mapPreviousConversations;
