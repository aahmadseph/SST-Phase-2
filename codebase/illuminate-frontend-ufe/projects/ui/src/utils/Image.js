import urlUtils from 'utils/Url';
import { IMAGE_SIZES } from 'components/ProductPage/ProductMediaCarousel/constants';

const { getImagePath, getParams, removeParam } = urlUtils;

/**
 * Get Image Orientation - This function gets the actual EXIF data from an image file
 * @param {blob} file - Actual image file
 * @param {function} callback - result with the value for EXIF of image
 */
const getImageOrientation = function (file, callback) {
    const reader = new FileReader();

    reader.onload = function (event) {
        const view = new DataView(event.target.result);

        if (view.getUint16(0, false) !== 0xffd8) {
            // Not a JPEG
            return callback(-2);
        }

        const length = view.byteLength;
        let offset = 2;

        while (offset < length) {
            const marker = view.getUint16(offset, false);
            offset += 2;

            if (marker === 0xffe1) {
                if (view.getUint32((offset += 2), false) !== 0x45786966) {
                    return callback(-1);
                }

                const little = view.getUint16((offset += 6), false) === 0x4949;
                offset += view.getUint32(offset + 4, little);
                const tags = view.getUint16(offset, little);
                offset += 2;

                for (let i = 0; i < tags; i++) {
                    if (view.getUint16(offset + i * 12, little) === 0x0112) {
                        return callback(view.getUint16(offset + i * 12 + 8, little));
                    }
                }
                /*eslint no-bitwise: ["error", { "allow": ["&"] }] */
            } else if ((marker & 0xff00) !== 0xff00) {
                break;
            } else {
                offset += view.getUint16(offset, false);
            }
        }

        return callback(-1);
    };

    // Read the file as an Array buffer for processing
    reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
};

/**
 * Reset Image orientation - This function sets the correct EXIF data of image
 * @param {string} srcBase64 - Image in base 64 for processing
 * @param {blob} file - Actual image file
 * @param {function} callback - result of corrected image
 */
const resetOrientation = function (srcBase64, file, callback) {
    getImageOrientation(file, function (imgOrientation) {
        const img = new Image();
        img.onload = function () {
            const width = img.width,
                height = img.height,
                canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');

            // set proper canvas dimensions before transform & export
            if ([5, 6, 7, 8].indexOf(imgOrientation) > -1) {
                canvas.width = height;
                canvas.height = width;
            } else {
                canvas.width = width;
                canvas.height = height;
            }

            // transform context before drawing image
            switch (imgOrientation) {
                case 2:
                    ctx.transform(-1, 0, 0, 1, width, 0);

                    break;
                case 3:
                    ctx.transform(-1, 0, 0, -1, width, height);

                    break;
                case 4:
                    ctx.transform(1, 0, 0, -1, 0, height);

                    break;
                case 5:
                    ctx.transform(0, 1, 1, 0, 0, 0);

                    break;
                case 6:
                    ctx.transform(0, 1, -1, 0, height, 0);

                    break;
                case 7:
                    ctx.transform(0, -1, -1, 0, height, width);

                    break;
                case 8:
                    ctx.transform(0, -1, 1, 0, 0, width);

                    break;
                default:
                    ctx.transform(1, 0, 0, 1, 0, 0);
            }

            ctx.drawImage(img, 0, 0);
            callback(canvas.toDataURL());
        };
        // Read image to start process
        img.src = srcBase64;
    });
};

const getImageBadgeFromUrl = function (url) {
    const urlParams = new URLSearchParams(url);

    return urlParams.get('pb');
};

const getImageSrcPathFunc = function (src, size) {
    // remove any existing imwidth params before applying the correct ones
    const imgSrc = removeParam(src, 'imwidth');
    const symbol = Object.keys(getParams(imgSrc)).length ? '&' : '?';
    // ctfassets - contentfull hosted assets, they don't support renditions, we do use them in dev/qa
    // in prod we do use DAM hosted images, and they do support renditions through imwidth
    const imgWidthParam = y => (imgSrc?.indexOf('images.ctfassets.net') < 0 ? `${symbol}imwidth=${Math.ceil(size * y)}` : '');
    const path = (x = 1) => `${getImagePath(imgSrc)}${imgWidthParam(x)}`;

    return path;
};

const getImageSrc = function (src, size, isSrcSet) {
    const getPath = getImageSrcPathFunc(src, size);

    return isSrcSet ? `${getPath()} 1x, ${getPath(2)} 2x` : getPath();
};

const getImageUrlsForPreload = function ({ imageSrc }) {
    return [IMAGE_SIZES.SMALL, IMAGE_SIZES.LARGE].map(size => {
        const imageForPreload = getImageSrcForPreload(imageSrc, size);
        const { x1PixelDensityUrl: url1x, x2PixelDensityUrl: url2x } = imageForPreload;

        if (!url1x || !url2x) {
            return null;
        }

        return { url1x, url2x };
    });
};

const getImageSrcForPreload = function (src, size) {
    const getPath = getImageSrcPathFunc(src, size);

    return {
        x1PixelDensityUrl: getPath(1),
        x2PixelDensityUrl: getPath(2)
    };
};

const ImageUtil = {
    resetOrientation,
    getImageOrientation,
    getImageBadgeFromUrl,
    getImageSrc,
    getImageSrcForPreload,
    getImageUrlsForPreload
};

export default ImageUtil;
