import { useEffect, useState } from 'react';

/**
 * Custom hook to manage skeleton loading state with minimum duration
 * @param {Array} data - The data array to check for loading completion
 * @param {number} minDuration - Minimum duration to show skeleton (in milliseconds)
 * @param {number} totalItems - Total number of items expected (for skeleton count)
 * @returns {object} - { shouldShowLoading: boolean, skeletonCount: number }
 */
export const useSkeletonLoading = (data, minDuration = 500, totalItems = null) => {
    const [isLoading, setIsLoading] = useState(true);
    const [minLoadingTime, setMinLoadingTime] = useState(true);

    useEffect(() => {
        // Ensure skeleton shows for at least the minimum duration
        const minLoadingTimer = setTimeout(() => {
            setMinLoadingTime(false);
        }, minDuration);

        return () => clearTimeout(minLoadingTimer);
    }, [minDuration]);

    useEffect(() => {
        // Only set isLoading to false when both conditions are met:
        // 1. Data is available
        // 2. Minimum loading time has passed
        if (data && data.length >= 0 && !minLoadingTime) {
            setIsLoading(false);
        }
    }, [data, minLoadingTime]);

    // Show loading state if either condition is true
    const shouldShowLoading = isLoading || minLoadingTime || !data;

    // Calculate skeleton count based on available information
    const getSkeletonCount = () => {
        if (totalItems && totalItems > 0) {
            // Use actual total, but cap at a reasonable number for initial load
            return Math.min(totalItems, 12);
        }

        // Default fallback
        return 8;
    };

    return {
        shouldShowLoading,
        skeletonCount: getSkeletonCount()
    };
};

/**
 * Default configuration for skeleton loading
 */
export const SKELETON_CONFIG = {
    DEFAULT_DURATION: 500,
    CAROUSEL_DURATION: 300,
    GRID_DURATION: 500,
    DEFAULT_SKELETON_COUNT: 8,
    MAX_SKELETON_COUNT: 12
};
