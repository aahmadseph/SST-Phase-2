import { space, site } from 'style/config';

const CARDS_PER_SLIDE = 5;
const CARD_GAP = [2, 3];
const CARD_WIDTH = (site.containerMax - space[CARD_GAP[1]] * (CARDS_PER_SLIDE - 1)) / CARDS_PER_SLIDE;
const IMAGE_HEIGHT = 180;
const BUTTON_WIDTH = 112;

export {
    CARD_GAP, CARD_WIDTH, CARDS_PER_SLIDE, IMAGE_HEIGHT, BUTTON_WIDTH
};
