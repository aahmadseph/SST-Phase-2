# Jest Testing Guidelines

## Test Structure and Comments

Use Arrange, Act, Assert (AAA) comments to clearly separate the logic phases of your tests:

-   **Arrange**: Set up test data and prepare the environment
-   **Act**: Execute the code under test or trigger the action being tested
-   **Assert**: Verify the expected behavior occurred

## Testing with React Testing Library

When writing tests for React components, follow React Testing Library (RTL) v12.1.5 best practices by creating **integration tests** that render and test components with their actual dependencies rather than using mocks.

### Key Guidelines:

-   **Test behavior over implementation details** to ensure tests accurately reflect how users interact with components
-   **Do not mock React components** when writing tests
-   Tests should be **integration tests** that render components with their actual child components and dependencies
-   Mocking React components breaks the integration testing approach and prevents testing the actual user experience
-   **Only mock configuration when necessary** - avoid mocking almost everything else
-   **Load initial Redux state from JSON files** - these mock files should exist before creating tests for the related component
-   **Clone initial Redux state using `window.structuredClone`** to avoid mutations in the global state by component code or other user code
-   Store cloned state in a variable that can be reused across test cases within the same test suite, cloning fresh data in `beforeEach` for each test

### Rendering Components

Always use the `render` function from our test utilities library. Import all React Testing Library utilities from 'test-utils' instead of importing RTL directly:

```javascript
import { render } from 'test-utils';
```

The `render` function accepts a second argument for options, including setting the initial Redux state:

```javascript
const { getByText } = render(<SomeReactComponent />, { redux: reduxState });
```

### Redux State Management

When testing components that use Redux state, always use actual data from the Redux state for component props rather than user-defined mock data. This ensures tests reflect the real user experience by testing exactly what users will see when the component receives the actual Redux data in production.

#### Legacy Store Mocking

For compatibility with obsolete code that may require direct store access, use `jest.spyOn(store, 'getState').mockReturnValue(reduxState)` to mock the store's getState method. This should only be used when code directly access Redux store rather than receiving data from selectors. When using this approach, ensure both the store mock and the render function are initialized with the same Redux state data to maintain consistency.

#### Example Implementation

```javascript
import { render } from 'test-utils';
import DeliveryOptions from 'components/ProductPage/DeliveryOptions';
import pageState from '__mocks__/pageData/productPage/cream-lip-stain-liquid-lipstick-P281411_DeliveryOptions.json';
import ssrState from '__mocks__/pageData/productPage/cream-lip-stain-liquid-lipstick-P281411.json';
import store from 'store/Store';

describe('DeliveryOptions component', () => {
    let reduxState;

    beforeEach(async () => {
        // Create a deep copy - don't use JSON.parse(JSON.stringify( as it's 2 times slower
        reduxState = window.structuredClone(ssrState);
    });

    test('should render with SSR data', async () => {
        // Arrange
        const ssrData = 'FREE standard shipping';

        // Act
        const { getByText } = render(
            <DeliveryOptions
                currentProduct={reduxState.page.product}
                serviceUnavailable={false}
            />,
            { redux: reduxState }
        );

        // Assert
        expect(getByText(ssrData)).toBeInTheDocument();
    });

    describe('', () => {
        let reduxState;

        beforeEach(async () => {
            reduxState = window.structuredClone(pageState);
        });

        test('should render with p13n data', async () => {
            // Arrange
            const p13Data = 'Delivery by Thu, Apr 10 to 95124';
            jest.spyOn(store, 'getState').mockReturnValue(reduxState);

            // Act
            const { getByText } = render(
                <DeliveryOptions
                    currentProduct={reduxState.page.product}
                    serviceUnavailable={false}
                />,
                { redux: reduxState }
            );

            // Assert
            expect(getByText(p13Data)).toBeInTheDocument();
        });
    });
});
```

## API Testing with Mock Service Worker (MSW)

For components that make API calls, use Mock Service Worker (MSW) v2.8.4 to intercept network requests at the network level rather than mocking API client functions directly. This approach allows testing the complete request/response flow while maintaining realistic component behavior and preserving the contract between your frontend and API.

### Import from Test Utils

When mocking APIs with MSW, always import from our test utilities library instead of importing MSW directly:

```javascript
import { server, http, HttpResponse } from 'test-utils';
```

### Creating API Mocks

Create API mocks by adding request handlers to the server. Here's an example of how to mock a POST endpoint:

```javascript
server.use(
    http.post('/api/shopping-cart/basket/promotions', async ({ request }) => {
        requestHeaders = request.headers;
        requestBody = await request.json();

        return HttpResponse.json(mockSuccessResponse);
    })
);
```

### MSW Best Practices

-   Use `server.use()` to add request handlers for specific tests
-   Access request data through the `request` parameter (headers, body, etc.)
-   Return responses using `HttpResponse.json()`, `HttpResponse.text()`, or other HttpResponse methods
-   Handlers can be async to simulate real network delays or complex response logic

## Test Cleanup

Do not call `.resetHandlers()`, `.clearAllMocks()`, or `.restoreAllMocks()` at the individual test level. These cleanup functions are already configured globally in the test setup, so calling them in individual tests is redundant and unnecessary.
