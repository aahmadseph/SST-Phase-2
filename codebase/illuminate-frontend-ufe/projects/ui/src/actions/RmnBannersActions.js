import { SET_RMN_BANNERS_MAIN, CLEAR_RMN_BANNERS } from 'constants/actionTypes/rmnBanners';
import { SET_SPONSOR_PRODUCTS, RESET_SPONSOR_PRODUCTS, SET_SPONSOR_PRODUCTS_FAILURE } from 'constants/actionTypes/sponsorProducts';

export const updateRmnMainBanners = data => ({
    type: SET_RMN_BANNERS_MAIN,
    payload: {
        rmnBanners: data
    }
});

export const clearRmnBanners = () => ({
    type: CLEAR_RMN_BANNERS,
    payload: {
        rmnBanners: null
    }
});

export const updatePlasSponsoredProducts = data => ({
    type: SET_SPONSOR_PRODUCTS,
    payload: data
});

export const resetPlasSponsoredProducts = () => ({
    type: RESET_SPONSOR_PRODUCTS
});

export const failPlasSponsoredProducts = () => ({
    type: SET_SPONSOR_PRODUCTS_FAILURE
});
