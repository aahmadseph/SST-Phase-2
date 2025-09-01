function isFrtrMissing() {
    const url = '/76a6869615db/script.js';
    const scripts = document.getElementsByTagName('script');

    for (let i = scripts.length; i--; ) {
        if (scripts[i].src && scripts[i].src !== '' && scripts[i].src.indexOf(url) > -1) {
            return false;
        }
    }

    return true;
}

export default { isFrtrMissing };
