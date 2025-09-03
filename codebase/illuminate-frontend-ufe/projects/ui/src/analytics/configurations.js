/* eslint max-len: [0] */
/**
 * These analytics related configurations used to live in
 * Signal libraries such as wa and wa2. They are used by
 * the s_code for setup.
 */

const reportingStates = [
    {
        NAME: 'production',
        HOSTS: [
            'www.sephora.com',
            'shop.sephora.com',
            'sephora.com',
            'reviews.sephora.com',
            'community.sephora.com',
            's.brandingbrandmobile.com',
            'beta.sephora.com',
            'illuminate.becho.net',
            'www.sephoracanada.com',
            'birthday.sephora.com',
            'sephoralove.com',
            'www.sephoralove.com',
            'sephoralove.ca',
            'www.sephoralove.ca',
            'app.sephora.com',
            'sephora.skedge.me',
            'reserve.sephora.com',
            'canada.sephora.com',
            'www.sephora.ca',
            'sephora.ca',
            'fr-canada.sephora.com',
            'coloroftheyear.sephora.com',
            'gallery.sephora.com',
            'sephora.cashstar.com',
            'www.sephoravirtualartist.com',
            'sephoravirtualartist.com',
            'sephoracolorcorrect.com',
            'colorcorrect.sephora.com',
            'www.sephora.sg',
            'www.sephora.my',
            'www.sephora.co.id',
            'www.sephora.co.th',
            'www.sephora.com.au',
            'www.sephora.com.bn',
            'www.sephora.nz',
            'www.sephora.hk',
            'sephorahairtutorial.com',
            'hairtutorial.sephora.com'
        ],
        SITECATALYST_REPORT: 'sephoracom'
    },
    {
        NAME: 'sephora 2.0 beta',
        HOSTS: ['beta.sephora.com', 'illuminate.becho.net', 'app.sephora.com'],
        SITECATALYST_REPORT: 'sephora-2beta'
    },
    {
        NAME: 'sephora canada',
        HOSTS: ['www.sephoracanada.com'],
        SITECATALYST_REPORT: 'sephora-canada-prod'
    },
    {
        NAME: 'preproduction',
        HOSTS: [
            'local.sephora.com',
            'localhost',
            'qa.sephora.com',
            'preview.qa.sephora.com',
            'staging.merchantmail.net',
            'sandbox.qa.sephora.com',
            'origin.qa.sephora.com',
            'staging.illuminate.sephora.com',
            'staging.sephora.com',
            'dev.illuminate.sephora.com',
            'dev.sephora.com',
            'qa.illuminate.sephora.com',
            'community.qa.sephora.com',
            'ebf.sephora.com',
            'qa-sephora.skedge.me',
            'dev.reserve.sephora.com',
            'dev-canada.sephora.com',
            'fr-dev-canada.sephora.com',
            'qa-canada.sephora.com',
            'fr-qa-canada.sephora.com',
            'fr-sephora-dev.onelink-translations.com',
            'fr-sephora-qa.onelink-translations.com',
            'gallery-qa.sephora.com',
            'sephora-semiprod.cashstar.com',
            'sephoracolorcorrect.com',
            'colorcorrect.sephora.com',
            'qa.sephora.sg',
            'qa.sephora.my',
            'qa.sephora.co.id',
            'qa.sephora.co.th',
            'qa.sephora.com.au',
            'qa.sephora.com.bn',
            'qa.sephora.nz',
            'qa.sephora.hk',
            'sephorahairtutorial.com',
            'hairtutorial.sephora.com',
            new RegExp('\\d+\\.\\d+\\.\\d+\\.\\d+')
        ],
        SITECATALYST_REPORT: 'sephorarenew'
    },
    {
        NAME: 'mobile preproduction',
        HOSTS: [],
        SITECATALYST_REPORT: 'sephora-mobile-dev'
    },
    {
        NAME: 'mobile production',
        HOSTS: ['s.brandingbrand.com', 'illuminate.becho.net', 'app.sephora.com'],
        SITECATALYST_REPORT: 'sephora-mobile-prod'
    }
];

const getConfigs = () => {
    var sitecatalyst = { scReports: '' };

    var internalHosts = [];

    var host = location.hostname.toLowerCase();

    var inStringRegExpList = function (a, v) {
        for (let i = a.length; i--; ) {
            if ((typeof a[i] === 'string' && a[i] === v) || (a[i] instanceof RegExp && a[i].test(v))) {
                return true;
            }
        }

        return false;
    };

    for (let len = reportingStates.length, i = 0, found = 0; i < len; i++) {
        const state = reportingStates[i];

        if (inStringRegExpList(state.HOSTS, host)) {
            sitecatalyst.scReports += found > 0 ? ',' + state.SITECATALYST_REPORT : state.SITECATALYST_REPORT;
            internalHosts = internalHosts.concat(state.HOSTS);
            found++;
        }
    }

    if (sitecatalyst.scReports === '') {
        sitecatalyst.scReports = 'sephorarenew';
    }

    /**** Public Export ********/

    var configs = {
        internalHosts,
        orgDomains: [
            'google.',
            'bing.',
            'a9.',
            '*,q',
            'abacho.',
            'ah-ha.',
            'alexa.',
            'allesklar.',
            'wo,words',
            'alltheweb.',
            'q,query',
            'altavista.',
            'aol.',
            'arianna.',
            'query,b1',
            'asiaco.',
            'query,qry',
            'ask.',
            'q,ask',
            'atlas.',
            'austronaut.',
            'begriff,suche',
            'auyantepui.',
            'clave',
            'bluewin.',
            'qry,q',
            'centrum.',
            'club-internet.',
            'dino-online.',
            'dir.com.',
            'req',
            'dmoz.',
            'search',
            'dogpile.',
            'q,qkw',
            'eniro.',
            'euroseek.',
            'string,query',
            'exalead.',
            'excite.',
            'search,s,qkw',
            'findlink.',
            'key',
            'findwhat.',
            'mt',
            'fireball.',
            'freeserve.',
            'gigablast.',
            'go2net.',
            'general',
            'goeureka.',
            'key',
            'q,as_q,as_epq,as_oq',
            'googlesyndication.',
            'url',
            'greekspider.',
            'keywords',
            'hotbot.',
            'query,mt',
            'ilor.',
            'iltrovatore.',
            'index.nana.co.il.',
            'infoseek.',
            'qt,q',
            'infospace.',
            'qkw',
            'intuitsearch.',
            'iwon.',
            'ixquick.',
            'jubii.',
            'query,soegeord',
            'jyxo.',
            's',
            'kanoodle.',
            'kataweb.',
            'kvasir.',
            'live.',
            'looksmart.',
            'qt,key,querystring',
            'lycos.',
            'query,mt,q,qry',
            'mamma.',
            'metacrawler.',
            'q,general,qry',
            'msn.',
            'q,mt',
            'mywebsearch.',
            'searchfor',
            'mysearch.',
            'netex.',
            'srchkey,keyword',
            'netscape.',
            'search,searchstring,query',
            'netster.',
            'nettavisen.',
            'query,q',
            'ninemsn.',
            'nlsearch.',
            'qr',
            'nomade.',
            'mt,s',
            'northernlight.',
            'oozap.',
            'overture.',
            'ozu.',
            'passagen.',
            'quick.',
            'ftxt_query',
            'savvy.',
            'scrubtheweb.',
            'keyword,q',
            'www.search.com.',
            'searchalot.',
            'searchhippo.',
            'sensis.',
            'find',
            'seznam.',
            'w',
            'soneraplaza.',
            'qt',
            'splatsearch.',
            'searchstring',
            'sprinks.',
            'terms',
            'spray.',
            'srch.',
            'supereva.',
            'teoma.',
            'thunderstone.',
            'tiscali.ch.',
            'key',
            'tjohoo.',
            'soktext,mt,query',
            'track.',
            'truesearch.',
            'tygo.',
            'vinden.',
            'virgilio.',
            'qs',
            'vivisimo.',
            'voila.',
            'kw',
            'walla.',
            'wanadoo.',
            'fkw',
            'web.',
            'su',
            'webcrawler.',
            'qkw,search,searchtext',
            'webwatch.',
            'findindb',
            'wepa.',
            'query',
            'wisenut.',
            'xpsn.',
            'kwd',
            'ya.',
            'yahoo.',
            'p,va,vp,vo',
            'ynet.',
            'q',
            'zerx.'
        ],
        reportingStates
    };

    return configs;
};

export default {
    reportingStates,
    getConfigs
};
