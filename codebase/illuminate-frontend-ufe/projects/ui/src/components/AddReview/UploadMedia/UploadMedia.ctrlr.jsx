import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import { radii, colors, space } from 'style/config';
import IconCross from 'components/LegacyIcon/IconCross';
import ErrorMsg from 'components/ErrorMsg';

import LanguageLocale from 'utils/LanguageLocale';
import Debounce from 'utils/Debounce';
import decorators from 'utils/decorators';

import bvService from 'services/api/thirdparty/BazaarVoice';

const { getLocaleResourceFile } = LanguageLocale;
const { withInterstice } = decorators;

class UploadMedia extends BaseClass {
    state = {
        maxPhotos: 2,
        media: {},
        errors: []
    };

    render() {
        const getText = getLocaleResourceFile('components/AddReview/UploadMedia/locales', 'UploadMedia');
        const { maxPhotos } = this.state;

        const currentKeys = Object.keys(this.state.media).length;
        const photoSlots = [];
        const end = currentKeys + 1 > maxPhotos ? maxPhotos : currentKeys + 1;

        for (let i = 1; i <= end; i++) {
            const elementKey = 'photourl_' + i;
            photoSlots.push(this.getFilePicker(elementKey));
        }

        return (
            <React.Fragment>
                <div css={styles.slotWrap}>{photoSlots}</div>
                {this.state.errors[0] && (
                    <ErrorMsg
                        marginTop={3}
                        children={getText('somethingWentWrongError')}
                    />
                )}
            </React.Fragment>
        );
    }

    getFilePicker = key => {
        const getText = getLocaleResourceFile('components/AddReview/UploadMedia/locales', 'UploadMedia');

        const thumbnailUrl = this.state.media[key];

        return (
            <div
                key={key}
                css={styles.pickerRoot}
            >
                {thumbnailUrl ? (
                    <div
                        css={styles.thumb}
                        style={{
                            backgroundImage: `url(${thumbnailUrl})`
                        }}
                    >
                        <button
                            aria-label={getText('removePhoto')}
                            type='button'
                            onClick={e => this.removeMedia(e, key)}
                            css={styles.removeBtn}
                        >
                            <IconCross x={true} />
                        </button>
                    </div>
                ) : (
                    <React.Fragment>
                        <input
                            id={key}
                            onChange={e => this.handleUpload(e, key)}
                            type='file'
                            css={styles.input}
                        />
                        <label
                            htmlFor={key}
                            aria-label={getText('addPhoto')}
                            css={styles.label}
                        >
                            <IconCross fontSize={40} />
                        </label>
                    </React.Fragment>
                )}
            </div>
        );
    };

    handleUpload = Debounce.preventDoubleClick((e, pickerKey) => {
        if (e.target.files.length) {
            const file = e.target.files[0];
            const newMediaContainer = Object.assign({}, this.state.media);
            withInterstice(bvService.uploadPhoto)(file)
                .then(photo => {
                    if (photo.errors) {
                        this.setState({ errors: photo.errors });

                        return;
                    }

                    newMediaContainer[pickerKey] = photo.thumbnailUrl;
                    this.setState(
                        {
                            hasMedia: true,
                            media: newMediaContainer,
                            errors: []
                        },
                        () => {
                            this.props.onChange(newMediaContainer);
                        }
                    );
                })
                .catch(error => {
                    if (!error.apiFailed) {
                        this.setState({ errors: error.errors });
                    }
                    // TODO: React on Upload Photo errors
                });
        }
    });

    removeMedia = (evt, key) => {
        const newMediaContainer = Object.assign({}, this.state.media);
        const mediaKeys = Object.keys(newMediaContainer);

        if (key === mediaKeys[0] && mediaKeys.length > 1) {
            const otherKey = mediaKeys[1];
            newMediaContainer[key] = newMediaContainer[otherKey];
            delete newMediaContainer[otherKey];
        } else {
            delete newMediaContainer[key];
        }

        const newHasMedia = mediaKeys.length > 0;
        this.setState(
            {
                hasMedia: newHasMedia,
                media: newMediaContainer
            },
            () => {
                this.props.onChange(newMediaContainer);
            }
        );
    };
}

const styles = {
    slotWrap: {
        display: 'flex'
    },
    pickerRoot: {
        position: 'relative',
        width: 102,
        height: 102,
        marginRight: space[4]
    },
    input: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0,
        ':focus + label': {
            outline: `1px dashed ${colors.black}`,
            outlineOffset: space[1]
        }
    },
    label: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        cursor: 'pointer',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: colors.nearWhite,
        borderRadius: radii[2],
        border: `1px solid ${colors.midGray}`,
        ':hover': {
            borderColor: colors.black
        }
    },
    thumb: {
        position: 'absolute',
        inset: 0,
        borderRadius: radii[2],
        backgroundPosition: 'center',
        backgroundSize: 'cover'
    },
    removeBtn: {
        position: 'absolute',
        top: '-.5em',
        right: '-.5em',
        width: '2em',
        height: '2em',
        textAlign: 'center',
        lineHeight: 0,
        borderRadius: 99999,
        color: colors.black,
        border: `2px solid ${colors.black}`,
        backgroundColor: colors.white
    }
};

export default wrapComponent(UploadMedia, 'UploadMedia', true);
