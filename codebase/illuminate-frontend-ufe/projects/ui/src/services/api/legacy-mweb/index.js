// This API section contains methods to trigger all legacy (mweb TOM) endpoints
// which are still being used.
// Unfortunately, those API endpoints are not documented.

import getCategoryHierarchy from 'services/api/legacy-mweb/getCategoryHierarchy';

export default { getCategoryHierarchy: getCategoryHierarchy.getCategoryHierarchy };
