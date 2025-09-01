import crypto from 'node:crypto';

const CURRENT_PID = process.pid;

export default function requestIDMiddleware(request, response, next) {

    // something super simple to compute, that is mostly unique
    request.headers['request-id'] = `${CURRENT_PID}-${crypto.randomUUID()}`;

    next();
}
