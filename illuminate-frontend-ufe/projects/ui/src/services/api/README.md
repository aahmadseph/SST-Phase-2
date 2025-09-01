PLEASE RESPECT THE BELOW CONVENTION
USED THROUGHOUT ALL OF THE services/api FOLDER.

---

1. Organize directories and methods not by what makes sense to us at the moment,
   but to reflect the structure of the API as it is on the ATG side.

Let this page be the starting point:
https://jira.sephora.com/wiki/display/ILLUMINATE/Mobile+APIs

Please mind that all of the directories are already created.

Consult with Mykhaylo Gavrylyuk if you have any questions or need a guide
through.

2. Use right vocabulary:

`.then(data => ...`, not `.then(response => ...`, because `response` is a term
used for low-level HTTP responses, and on this level what we're getting is
really nothing more than the high-level data. Not `json` either because,
technically, json is a string and not an object.

3. Keep style consistent.

3.1. While handling `.then(data => ...` stick to using the brevity form
`.then(data => data.errorCode ? Promise.reject(data) : data)` instead of
variations that come to mind, because being consistent with this has its
benefits.

3.2. Because of the tests stubbing UFE peculiarity, use this form
`const ufeApi = require('services/api/ufeApi').default;` and use makeRequest like
`ufeApi.makeRequest('/some/url/'), {...})`.
NOT `const makeRequest = require('services/api/ufeApi').makeRequest;` and
`makeRequest('/some/url/'), {...})`.
