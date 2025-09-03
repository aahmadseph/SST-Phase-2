const getArtistName = resource => {
    if (resource?.resourceId === 'ANY_ARTIST') {
        return resource.displayName;
    }

    if (resource?.displayName) {
        const artistName = resource?.displayName.split(', ');

        return `${artistName[1]} ${artistName[0][0]}`;
    } else {
        return `${resource?.employee?.firstName} ${(resource?.employee?.lastName || '')[0]}`;
    }
};

export default { getArtistName };
