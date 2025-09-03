(function () {
    // In production Akamai creates a current_country cookie based on the users country
    // We mock that cookie here for local environments since it is not
    // being done by Akamai
    var COUNTRY_CODE = 'US';
    var date = new Date(2030, 1);
    document.cookie = 'current_country' + '=' + COUNTRY_CODE + '; Expires' + date.toUTCString() + ';path=/';
}());
