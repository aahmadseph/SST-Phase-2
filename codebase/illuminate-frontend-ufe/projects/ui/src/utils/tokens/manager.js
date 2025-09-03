/* eslint-disable no-await-in-loop */
import loader from 'utils/tokens/loader';
import replacer from 'utils/tokens/replacer';

export default {
    evaluator(content) {
        if (typeof content !== 'string') {
            return Promise.reject(new Error('Content is not a valid string'));
        }

        const elements = content.match(/~{(\w+).(\w+)}/gm);

        if (!Array.isArray(elements) || elements.length === 0) {
            return Promise.resolve(content);
        }

        const promises = elements.map(element => {
            const [handler, value] = element.replace(/^~{|}$/g, '').split('.');

            return loader
                .getHandlerPackage(handler)
                .then(handlerPackage => replacer.getTokenValue(value, handlerPackage.process))
                .then(newValue => [element, newValue])
                .catch(() => [element, '']);
        });

        return Promise.all(promises).then(result =>
            result.reduce((rawContent, token) => {
                const [element, value] = token;

                // eslint-disable-next-line no-param-reassign
                rawContent = rawContent.replace(element, value);

                return rawContent;
            }, content)
        );
    }
};
