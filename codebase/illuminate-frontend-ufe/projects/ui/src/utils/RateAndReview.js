const sanitizeWriteReviewCharacterCount = (input = '') => {
    let adjustedLength = 0;
    let index = 0;

    //replaces all whitespace characters (spaces, tabs, newlines, non-breaking spaces) with same number of spaces
    const sanitizedInput = input.replace(/[\s\u00A0]+/g, match => ' '.repeat(match.length));

    while (index < sanitizedInput.length) {
        // Check if there are 3 or more consecutive spaces
        if (
            index < sanitizedInput.length - 2 &&
            sanitizedInput[index] === ' ' &&
            sanitizedInput[index + 1] === ' ' &&
            sanitizedInput[index + 2] === ' '
        ) {
            // Skip over all consecutive spaces
            while (index < sanitizedInput.length && sanitizedInput[index] === ' ') {
                index++;
            }
        } else {
            // Count non-space characters or sequences of 1 or 2 spaces
            adjustedLength++;
            index++;
        }
    }

    return adjustedLength;
};

export default sanitizeWriteReviewCharacterCount;
