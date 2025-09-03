const ufeToken = 'UFE_AUTH_TOKEN';

import sdnToken from 'services/api/sdn/sdnToken';

import entryPointPrompts from 'ai/services/superChat/entryPointPrompts';
import feedback from 'ai/services/superChat/feedback';
import managerSession from 'ai/services/superChat/managerSession';
import superChatConfig from 'ai/services/superChat/superChatConfig';
import previousConversations from 'ai/services/superChat/previousConversations';

const withSdnToken = sdnToken.withSdnToken;

export default {
    entryPointPrompts: withSdnToken(entryPointPrompts, ufeToken),
    feedback: withSdnToken(feedback, ufeToken),
    managerSession: withSdnToken(managerSession, ufeToken),
    superChatConfig: withSdnToken(superChatConfig, ufeToken),
    previousConversations: withSdnToken(previousConversations, ufeToken)
};
