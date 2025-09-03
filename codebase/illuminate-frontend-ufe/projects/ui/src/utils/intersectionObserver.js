import isFunction from 'utils/functions/isFunction';

//isWatch: true to persist observer and send back to callback, false to disconnect on first observation
export const setIntersectionObserver = (currentRef, cb, options = {}, isWatch = false) => {
    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            isFunction(cb) && (isWatch ? cb(true, observer) : cb());
            !isWatch && observer.disconnect();
        } else if (isWatch) {
            isFunction(cb) && cb(false, observer);
        }
    }, options);

    if (currentRef) {
        observer.observe(currentRef);
    }
};
