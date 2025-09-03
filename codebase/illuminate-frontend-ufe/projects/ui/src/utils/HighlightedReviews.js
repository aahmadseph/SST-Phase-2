const HighlightedReviews = {
    // Given a string and a list of ranges containg startIndex and endIndex, returns a string with the ranges highlighted
    highlightRange: ({ quote, ranges }) => {
        let previousIndex = 0;
        const slices = [];
        const strongOpen = '<strong>';
        const strongClose = '</strong>';

        // Make sure the ranges are ordered by startIndex so that there's no overlap in the slices
        const orderedRanges = ranges?.sort((a, b) => a.startIndex < b.startIndex);

        // Separate the quote into slices, adding the strong tags around the highlighted ranges
        orderedRanges?.forEach((range, index, array) => {
            const { startIndex, endIndex } = range;

            // Adding 1 to the endIndex because the slice method doesn't include the endIndex
            const highlightedSlice = quote.slice(startIndex, endIndex + 1);
            const previousSlice = quote.slice(previousIndex, startIndex);

            // Update the previousIndex to the endIndex + 1 so that the next slice starts at the right index
            previousIndex = endIndex + 1;
            slices.push(previousSlice);
            slices.push(strongOpen);
            slices.push(highlightedSlice);
            slices.push(strongClose);

            // If this is the last range, add the remaining slice
            if (index === array.length - 1) {
                slices.push(quote.slice(endIndex + 1));
            }
        });

        return slices.join('');
    }
};

export default HighlightedReviews;
