function convertMarkdownLinksToJiraFormat(text) {
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

    const convertedText = text.replace(markdownLinkRegex, (match, textContent, url) => {
        // Return format: [Text|URL]
        return `[${textContent}|${url}]`;
    });

    return convertedText;
}

export default convertMarkdownLinksToJiraFormat;
