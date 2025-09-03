/**
 * Initializes Instagram embed script and processes embeds
 * @returns {boolean} True if initialization was attempted, false otherwise
 */
export const initializeInstagramEmbeds = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    if (!window.instgrm) {
        // Script not loaded yet, add it to DOM
        const existingScript = document.querySelector('script[src*="instagram.com/embed.js"]');

        if (!existingScript) {
            const script = document.createElement('script');
            script.src = 'https://www.instagram.com/embed.js';
            script.async = true;
            script.onload = () => {
                Sephora.logger.verbose('Instagram embed script loaded');

                if (window.instgrm) {
                    window.instgrm.Embeds.process();
                }
            };
            document.head.appendChild(script);

            return true;
        }
    } else if (window.instgrm) {
        // Script already loaded, just process embeds
        window.instgrm.Embeds.process();

        return true;
    }

    return false;
};

/**
 * Checks if a path is a posts listing page
 * @param {string} path - The path to check
 * @returns {boolean} True if the path is the posts listing page
 */
export const isPostsPath = path => {
    return path && path.endsWith('/posts');
};
