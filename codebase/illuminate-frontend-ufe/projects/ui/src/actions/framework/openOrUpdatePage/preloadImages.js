import { OPEN_SPA_PAGE_IMAGES_PRELOADED, OPEN_SPA_PAGE_IMAGES_PRELOADING } from 'constants/performance/marks';
import Empty from 'constants/empty';
import Perf from 'utils/framework/Perf';

let imagesToPreloadCounter = 0;

Perf.preloadedImagesCounter = () => {
    imagesToPreloadCounter--;

    if (imagesToPreloadCounter === 0) {
        Perf.report(OPEN_SPA_PAGE_IMAGES_PRELOADED);
    }
};

const preloadImages = (imagesToPreload = Empty.Array) => {
    Perf.report(OPEN_SPA_PAGE_IMAGES_PRELOADING);
    imagesToPreloadCounter = imagesToPreload.length;

    if (imagesToPreloadCounter) {
        let html = '';
        imagesToPreload
            .filter(item => item && item.x1PixelDensityUrl && item.x2PixelDensityUrl)
            .forEach(({ x1PixelDensityUrl: url1x, x2PixelDensityUrl: url2x }) => {
                html += `<link rel='preload' href='${url1x}' imagesrcset='${url1x} 1x, ${url2x} 2x' as='image' importance='high' onload='Sephora.Util.Perf.preloadedImagesCounter()' >`;
            });

        if (html) {
            document.head.insertAdjacentHTML('afterbegin', html);
        }
    } else {
        Perf.report(OPEN_SPA_PAGE_IMAGES_PRELOADED);
    }
};

export default preloadImages;
