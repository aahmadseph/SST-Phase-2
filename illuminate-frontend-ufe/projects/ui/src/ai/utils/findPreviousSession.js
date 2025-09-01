import { ENTRYPOINTS } from 'ai/constants/superchat';

function findPreviousSession(conversationResponse, entryPointData) {
    if (!conversationResponse || !entryPointData) {
        return null;
    }

    if (entryPointData?.entrypoint === ENTRYPOINTS.PDP) {
        return conversationResponse.sessions
            .filter(session => session.entrypoint === ENTRYPOINTS.PDP)
            .find(session => session.products?.some(product => product.product_id === entryPointData.products?.[0]?.product_id))?.session_id;
    } else if (entryPointData?.entrypoint === ENTRYPOINTS.PLP) {
        return conversationResponse.sessions.find(
            session => session.entrypoint === ENTRYPOINTS.PLP && session.category_id === entryPointData.category_id
        )?.session_id;
    }

    return null;
}

export default findPreviousSession;
