export function getCsfRoute(path) {
    if (!path) {
        return { handle: '', section: '', identifier: '' };
    }

    const pathSegments = path.split('/').filter(Boolean);

    // Remove 'creators' if present
    if (pathSegments[0] === 'creators') {
        pathSegments.shift();
    }

    const handle = pathSegments[0] || '';
    const section = pathSegments[1] || '';
    const identifier = pathSegments[2] || ''; // For post-id or collection-id

    return {
        handle,
        section,
        identifier
    };
}
