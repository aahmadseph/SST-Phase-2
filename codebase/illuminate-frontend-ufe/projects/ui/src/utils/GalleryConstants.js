const exploreGallerySkeleton = [
    { height: 976 },
    { height: 1289 },
    { height: 838 },
    { height: 1367 },
    { height: 1124 },
    { height: 522 },
    { height: 824 },
    { height: 1369 },
    { height: 1345 },
    { height: 792 },
    { height: 1780 },
    { height: 1529 },
    { height: 861 },
    { height: 1752 },
    { height: 1834 },
    { height: 1838 },
    { height: 1485 },
    { height: 1356 },
    { height: 1787 },
    { height: 588 }
];

const loveInteractions = {
    LOVE: 'LOVE',
    UNLOVE: 'UNLOVE'
};

const socialMedia = {
    INSTAGRAM: 'INSTAGRAM',
    TIKTOK: 'TIKTOK',
    YOUTUBE: 'YOUTUBE',
    DESKTOP: 'DESKTOP'
};

const khorosInteractions = {
    PHOTO_UPLOADED: 'photo_uploaded',
    VIDEO_UPLOADED: 'video_uploaded',
    LOVES_GIVEN: 'looks_loves_given',
    LOVES_RECEIVED: 'looks_loves_received'
};

const DEFAULT_AVATAR_URL =
    'https://community.sephora.com/t5/image/serverpage/avatar-name/default-avatar/avatar-theme/sephora/avatar-collection/sephora/avatar-display-size/profile/version/2?xdesc=1.0';

export default {
    exploreGallerySkeleton,
    loveInteractions,
    socialMedia,
    DEFAULT_AVATAR_URL,
    khorosInteractions
};
