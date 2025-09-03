function roundToFirstButIgnoreZeroes(num) {
    return parseFloat(num.toFixed(1)).toString();
}

function formatReviewCount(count) {
    if (count > 999999) {
        return roundToFirstButIgnoreZeroes(count / 1000000) + 'M';
    } else if (count > 999) {
        return roundToFirstButIgnoreZeroes(count / 1000) + 'K';
    } else {
        return count;
    }
}

export default { formatReviewCount };
