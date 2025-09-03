# Detailed API Reference

## Overview
This document provides comprehensive API reference documentation for all services in the Sephora Vibe SST-Phase-2 system, based on the actual codebase implementation.

## 1. Product Service API

### dotcom-services-omni-product-service-app

#### Base URL
```
http://localhost:8080/api/v1
```

#### Authentication
All API endpoints require authentication using OAuth 2.0 or JWT tokens.

#### Product Management Endpoints

##### Get Product by ID
```http
GET /products/{productId}
```

**Parameters:**
- `productId` (path): Unique product identifier

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": {
    "amount": "number",
    "currency": "string"
  },
  "category": "string",
  "brand": "string",
  "images": ["string"],
  "attributes": {
    "color": "string",
    "size": "string",
    "material": "string"
  },
  "availability": "boolean",
  "createdAt": "string",
  "updatedAt": "string"
}
```

##### Get Products List
```http
GET /products
```

**Query Parameters:**
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 20)
- `category` (optional): Filter by category
- `brand` (optional): Filter by brand
- `priceMin` (optional): Minimum price filter
- `priceMax` (optional): Maximum price filter
- `sort` (optional): Sort field (name, price, createdAt)
- `order` (optional): Sort order (asc, desc)

**Response:**
```json
{
  "content": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": {
        "amount": "number",
        "currency": "string"
      },
      "category": "string",
      "brand": "string",
      "images": ["string"],
      "availability": "boolean"
    }
  ],
  "pageable": {
    "pageNumber": "number",
    "pageSize": "number",
    "totalElements": "number",
    "totalPages": "number"
  }
}
```

##### Create Product
```http
POST /products
```

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": {
    "amount": "number",
    "currency": "string"
  },
  "category": "string",
  "brand": "string",
  "attributes": {
    "color": "string",
    "size": "string",
    "material": "string"
  }
}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": {
    "amount": "number",
    "currency": "string"
  },
  "category": "string",
  "brand": "string",
  "attributes": {
    "color": "string",
    "size": "string",
    "material": "string"
  },
  "availability": "boolean",
  "createdAt": "string",
  "updatedAt": "string"
}
```

##### Update Product
```http
PUT /products/{productId}
```

**Parameters:**
- `productId` (path): Unique product identifier

**Request Body:** Same as Create Product

**Response:** Same as Create Product

##### Delete Product
```http
DELETE /products/{productId}
```

**Parameters:**
- `productId` (path): Unique product identifier

**Response:**
```json
{
  "message": "Product deleted successfully"
}
```

#### Commerce Tools Integration Endpoints

##### Sync Products from Commerce Tools
```http
POST /products/sync/commerce-tools
```

**Response:**
```json
{
  "message": "Product synchronization started",
  "syncId": "string",
  "status": "string"
}
```

##### Get Sync Status
```http
GET /products/sync/{syncId}/status
```

**Parameters:**
- `syncId` (path): Synchronization identifier

**Response:**
```json
{
  "syncId": "string",
  "status": "string",
  "progress": "number",
  "totalProducts": "number",
  "processedProducts": "number",
  "startedAt": "string",
  "completedAt": "string"
}
```

#### Health Check Endpoints

##### Service Health
```http
GET /actuator/health
```

**Response:**
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP"
    },
    "commerceTools": {
      "status": "UP"
    }
  }
}
```

##### Service Info
```http
GET /actuator/info
```

**Response:**
```json
{
  "app": {
    "name": "omni-product-service",
    "version": "1.0.0",
    "description": "Product management service"
  }
}
```

## 2. Product Aggregation Service API

### dotcom-services-product-aggregation-service-app

#### Base URL
```
http://localhost:8081/graphql
```

#### GraphQL Schema

##### Product Type
```graphql
type Product {
  id: ID!
  name: String!
  description: String
  price: Price!
  category: Category!
  brand: Brand!
  images: [String!]!
  attributes: ProductAttributes
  availability: Boolean!
  inventory: InventoryInfo
  sourcing: SourcingInfo
  createdAt: String!
  updatedAt: String!
}

type Price {
  amount: Float!
  currency: String!
  originalAmount: Float
  discountPercentage: Float
}

type Category {
  id: ID!
  name: String!
  parentCategory: Category
  subcategories: [Category!]!
}

type Brand {
  id: ID!
  name: String!
  description: String
  logo: String
}

type ProductAttributes {
  color: String
  size: String
  material: String
  weight: Float
  dimensions: Dimensions
}

type Dimensions {
  length: Float
  width: Float
  height: Float
  unit: String
}

type InventoryInfo {
  stockLevel: Int!
  availableQuantity: Int!
  reservedQuantity: Int!
  warehouse: String
  lastUpdated: String!
}

type SourcingInfo {
  supplier: String
  leadTime: Int
  minimumOrderQuantity: Int
  cost: Float
}
```

#### GraphQL Queries

##### Get Product by ID
```graphql
query GetProduct($id: ID!) {
  product(id: $id) {
    id
    name
    description
    price {
      amount
      currency
      originalAmount
      discountPercentage
    }
    category {
      id
      name
      parentCategory {
        name
      }
    }
    brand {
      id
      name
      logo
    }
    images
    attributes {
      color
      size
      material
    }
    availability
    inventory {
      stockLevel
      availableQuantity
      reservedQuantity
      warehouse
      lastUpdated
    }
    sourcing {
      supplier
      leadTime
      minimumOrderQuantity
      cost
    }
  }
}
```

##### Search Products
```graphql
query SearchProducts(
  $query: String!
  $category: String
  $brand: String
  $priceMin: Float
  $priceMax: Float
  $availability: Boolean
  $first: Int
  $after: String
) {
  searchProducts(
    query: $query
    category: $category
    brand: $brand
    priceMin: $priceMin
    priceMax: $priceMax
    availability: $availability
    first: $first
    after: $after
  ) {
    edges {
      node {
        id
        name
        price {
          amount
          currency
        }
        category {
          name
        }
        brand {
          name
        }
        images
        availability
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
```

##### Get Products by Category
```graphql
query GetProductsByCategory(
  $categoryId: ID!
  $first: Int
  $after: String
) {
  category(id: $categoryId) {
    id
    name
    products(first: $first, after: $after) {
      edges {
        node {
          id
          name
          price {
            amount
            currency
          }
          brand {
            name
          }
          images
          availability
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
}
```

#### GraphQL Mutations

##### Create Product
```graphql
mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    id
    name
    description
    price {
      amount
      currency
    }
    category {
      id
      name
    }
    brand {
      id
      name
    }
    createdAt
  }
}
```

**Input Type:**
```graphql
input CreateProductInput {
  name: String!
  description: String
  price: PriceInput!
  categoryId: ID!
  brandId: ID!
  attributes: ProductAttributesInput
}

input PriceInput {
  amount: Float!
  currency: String!
  originalAmount: Float
  discountPercentage: Float
}

input ProductAttributesInput {
  color: String
  size: String
  material: String
  weight: Float
  dimensions: DimensionsInput
}

input DimensionsInput {
  length: Float
  width: Float
  height: Float
  unit: String
}
```

## 3. Inventory & Availability Service API

### illuminate-services-inventory-availability-app

#### Base URL
```
http://localhost:8082/api/v1
```

#### Inventory Management Endpoints

##### Get Inventory by Product ID
```http
GET /inventory/products/{productId}
```

**Parameters:**
- `productId` (path): Product identifier

**Response:**
```json
{
  "productId": "string",
  "stockLevel": "number",
  "availableQuantity": "number",
  "reservedQuantity": "number",
  "warehouse": "string",
  "location": "string",
  "lastUpdated": "string",
  "nextRestockDate": "string",
  "supplier": "string",
  "leadTime": "number"
}
```

##### Get Inventory List
```http
GET /inventory
```

**Query Parameters:**
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 20)
- `productId` (optional): Filter by product ID
- `warehouse` (optional): Filter by warehouse
- `lowStock` (optional): Filter low stock items (boolean)
- `sort` (optional): Sort field (stockLevel, lastUpdated)

**Response:**
```json
{
  "content": [
    {
      "productId": "string",
      "stockLevel": "number",
      "availableQuantity": "number",
      "reservedQuantity": "number",
      "warehouse": "string",
      "lastUpdated": "string"
    }
  ],
  "pageable": {
    "pageNumber": "number",
    "pageSize": "number",
    "totalElements": "number",
    "totalPages": "number"
  }
}
```

##### Update Inventory
```http
PUT /inventory/products/{productId}
```

**Parameters:**
- `productId` (path): Product identifier

**Request Body:**
```json
{
  "stockLevel": "number",
  "availableQuantity": "number",
  "reservedQuantity": "number",
  "warehouse": "string",
  "location": "string",
  "supplier": "string",
  "leadTime": "number"
}
```

##### Reserve Inventory
```http
POST /inventory/products/{productId}/reserve
```

**Parameters:**
- `productId` (path): Product identifier

**Request Body:**
```json
{
  "quantity": "number",
  "reservationId": "string",
  "expiresAt": "string"
}
```

**Response:**
```json
{
  "reservationId": "string",
  "productId": "string",
  "quantity": "number",
  "status": "string",
  "expiresAt": "string",
  "createdAt": "string"
}
```

##### Release Inventory Reservation
```http
DELETE /inventory/reservations/{reservationId}
```

**Parameters:**
- `reservationId` (path): Reservation identifier

**Response:**
```json
{
  "message": "Reservation released successfully"
}
```

#### External Inventory Integration

##### Sync External Inventory
```http
POST /inventory/sync/external
```

**Request Body:**
```json
{
  "source": "string",
  "warehouse": "string",
  "syncType": "string"
}
```

**Response:**
```json
{
  "syncId": "string",
  "status": "string",
  "message": "string"
}
```

##### Get Sync Status
```http
GET /inventory/sync/{syncId}
```

**Parameters:**
- `syncId` (path): Synchronization identifier

**Response:**
```json
{
  "syncId": "string",
  "status": "string",
  "progress": "number",
  "totalItems": "number",
  "processedItems": "number",
  "startedAt": "string",
  "completedAt": "string",
  "errors": ["string"]
}
```

#### Health Check Endpoints

##### Service Health
```http
GET /actuator/health
```

**Response:**
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP"
    },
    "externalInventory": {
      "status": "UP"
    }
  }
}
```

## 4. Sourcing Service API

### illuminate-services-sourcing-service-app

#### Base URL
```
http://localhost:8083/api/v1
```

#### Supplier Management Endpoints

##### Get Suppliers List
```http
GET /suppliers
```

**Query Parameters:**
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 20)
- `category` (optional): Filter by supplier category
- `status` (optional): Filter by status (active, inactive)
- `sort` (optional): Sort field (name, rating, createdAt)

**Response:**
```json
{
  "content": [
    {
      "id": "string",
      "name": "string",
      "category": "string",
      "status": "string",
      "rating": "number",
      "contactInfo": {
        "email": "string",
        "phone": "string",
        "address": "string"
      },
      "createdAt": "string"
    }
  ],
  "pageable": {
    "pageNumber": "number",
    "pageSize": "number",
    "totalElements": "number",
    "totalPages": "number"
  }
}
```

##### Get Supplier by ID
```http
GET /suppliers/{supplierId}
```

**Parameters:**
- `supplierId` (path): Supplier identifier

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "category": "string",
  "status": "string",
  "rating": "number",
  "description": "string",
  "contactInfo": {
    "email": "string",
    "phone": "string",
    "address": "string",
    "website": "string"
  },
  "performance": {
    "onTimeDelivery": "number",
    "qualityRating": "number",
    "costRating": "number"
  },
  "createdAt": "string",
  "updatedAt": "string"
}
```

#### Contract Management Endpoints

##### Get Contracts List
```http
GET /contracts
```

**Query Parameters:**
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 20)
- `supplierId` (optional): Filter by supplier
- `status` (optional): Filter by status (active, expired, pending)
- `startDate` (optional): Filter by start date
- `endDate` (optional): Filter by end date

**Response:**
```json
{
  "content": [
    {
      "id": "string",
      "supplierId": "string",
      "supplierName": "string",
      "status": "string",
      "startDate": "string",
      "endDate": "string",
      "totalValue": "number",
      "currency": "string"
    }
  ],
  "pageable": {
    "pageNumber": "number",
    "pageSize": "number",
    "totalElements": "number",
    "totalPages": "number"
  }
}
```

##### Get Contract by ID
```http
GET /contracts/{contractId}
```

**Parameters:**
- `contractId` (path): Contract identifier

**Response:**
```json
{
  "id": "string",
  "supplierId": "string",
  "supplierName": "string",
  "status": "string",
  "startDate": "string",
  "endDate": "string",
  "totalValue": "number",
  "currency": "string",
  "terms": "string",
  "paymentTerms": "string",
  "deliveryTerms": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

#### Cost Optimization Endpoints

##### Get Cost Analysis
```http
GET /cost-analysis
```

**Query Parameters:**
- `productId` (optional): Filter by product
- `supplierId` (optional): Filter by supplier
- `dateFrom` (optional): Start date for analysis
- `dateTo` (optional): End date for analysis

**Response:**
```json
{
  "totalCost": "number",
  "currency": "string",
  "costBreakdown": [
    {
      "category": "string",
      "amount": "number",
      "percentage": "number"
    }
  ],
  "trends": [
    {
      "period": "string",
      "cost": "number",
      "change": "number"
    }
  ],
  "recommendations": ["string"]
}
```

## 5. Product Experience Service API

### illuminate-services-productexpservice-app

#### Base URL
```
http://localhost:8084/api/v1
```

#### Personalization Endpoints

##### Get Personalized Recommendations
```http
GET /personalization/recommendations
```

**Query Parameters:**
- `userId` (required): User identifier
- `category` (optional): Product category
- `limit` (optional): Number of recommendations (default: 10)

**Response:**
```json
{
  "userId": "string",
  "recommendations": [
    {
      "productId": "string",
      "productName": "string",
      "score": "number",
      "reason": "string",
      "category": "string"
    }
  ],
  "generatedAt": "string"
}
```

##### Update User Preferences
```http
PUT /personalization/preferences/{userId}
```

**Parameters:**
- `userId` (path): User identifier

**Request Body:**
```json
{
  "categories": ["string"],
  "brands": ["string"],
  "priceRange": {
    "min": "number",
    "max": "number"
  },
  "attributes": {
    "color": ["string"],
    "size": ["string"],
    "material": ["string"]
  }
}
```

#### A/B Testing Endpoints

##### Get Experiment Variant
```http
GET /experiments/{experimentId}/variant
```

**Parameters:**
- `experimentId` (path): Experiment identifier

**Query Parameters:**
- `userId` (required): User identifier
- `sessionId` (optional): Session identifier

**Response:**
```json
{
  "experimentId": "string",
  "variant": "string",
  "userId": "string",
  "sessionId": "string",
  "assignedAt": "string"
}
```

##### Track Experiment Event
```http
POST /experiments/{experimentId}/events
```

**Parameters:**
- `experimentId` (path): Experiment identifier

**Request Body:**
```json
{
  "userId": "string",
  "sessionId": "string",
  "variant": "string",
  "eventType": "string",
  "eventData": "object",
  "timestamp": "string"
}
```

#### Content Management Endpoints

##### Get Personalized Content
```http
GET /content/personalized
```

**Query Parameters:**
- `userId` (required): User identifier
- `contentType` (optional): Type of content
- `location` (optional): Content location on page

**Response:**
```json
{
  "userId": "string",
  "content": [
    {
      "id": "string",
      "type": "string",
      "title": "string",
      "description": "string",
      "image": "string",
      "link": "string",
      "priority": "number"
    }
  ],
  "generatedAt": "string"
}
```

## 6. Configuration Hub API

### dotcom-services-confighub-app

#### Base URL
```
http://localhost:8085/api/v1
```

#### Configuration Management Endpoints

##### Get Configuration
```http
GET /config/{serviceName}
```

**Parameters:**
- `serviceName` (path): Service identifier

**Query Parameters:**
- `environment` (optional): Environment (dev, staging, prod)
- `version` (optional): Configuration version

**Response:**
```json
{
  "serviceName": "string",
  "environment": "string",
  "version": "string",
  "config": "object",
  "lastUpdated": "string",
  "validFrom": "string",
  "validTo": "string"
}
```

##### Update Configuration
```http
PUT /config/{serviceName}
```

**Parameters:**
- `serviceName` (path): Service identifier

**Request Body:**
```json
{
  "environment": "string",
  "config": "object",
  "validFrom": "string",
  "validTo": "string"
}
```

##### Get Configuration History
```http
GET /config/{serviceName}/history
```

**Parameters:**
- `serviceName` (path): Service identifier

**Query Parameters:**
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 20)
- `fromDate` (optional): Start date
- `toDate` (optional): End date

**Response:**
```json
{
  "content": [
    {
      "version": "string",
      "environment": "string",
      "config": "object",
      "changedBy": "string",
      "changeReason": "string",
      "validFrom": "string",
      "validTo": "string",
      "createdAt": "string"
    }
  ],
  "pageable": {
    "pageNumber": "number",
    "pageSize": "number",
    "totalElements": "number",
    "totalPages": "number"
  }
}
```

#### Service Registry Endpoints

##### Register Service
```http
POST /registry/services
```

**Request Body:**
```json
{
  "serviceName": "string",
  "serviceUrl": "string",
  "healthCheckUrl": "string",
  "metadata": "object"
}
```

##### Get Registered Services
```http
GET /registry/services
```

**Response:**
```json
{
  "services": [
    {
      "serviceName": "string",
      "serviceUrl": "string",
      "healthCheckUrl": "string",
      "status": "string",
      "lastHealthCheck": "string",
      "metadata": "object"
    }
  ]
}
```

## 7. Frontend Application API

### illuminate-frontend-ufe

#### Base URL
```
http://localhost:3000
```

#### Client-Side API Integration

The frontend application integrates with all backend services through their respective APIs. The frontend acts as a client and consumes the APIs provided by:

- Product Service API
- Product Aggregation Service API (GraphQL)
- Inventory & Availability Service API
- Sourcing Service API
- Product Experience Service API
- Configuration Hub API

#### Frontend-Specific Endpoints

##### Get Application Configuration
```http
GET /api/config
```

**Response:**
```json
{
  "apiEndpoints": {
    "productService": "string",
    "inventoryService": "string",
    "sourcingService": "string",
    "productExperienceService": "string",
    "configurationHub": "string"
  },
  "features": {
    "personalization": "boolean",
    "aBTesting": "boolean",
    "analytics": "boolean"
  },
  "ui": {
    "theme": "string",
    "language": "string",
    "currency": "string"
  }
}
```

##### Get User Session
```http
GET /api/session
```

**Response:**
```json
{
  "userId": "string",
  "sessionId": "string",
  "authenticated": "boolean",
  "permissions": ["string"],
  "preferences": "object",
  "lastActivity": "string"
}
```

## 8. API Error Handling

### Standard Error Response Format

All APIs return errors in a consistent format:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object",
    "timestamp": "string",
    "path": "string"
  }
}
```

### Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request parameters
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource conflict
- **422 Unprocessable Entity**: Validation error
- **500 Internal Server Error**: Server error
- **503 Service Unavailable**: Service temporarily unavailable

### Error Codes

- **VALIDATION_ERROR**: Input validation failed
- **AUTHENTICATION_ERROR**: Authentication failed
- **AUTHORIZATION_ERROR**: Insufficient permissions
- **RESOURCE_NOT_FOUND**: Requested resource not found
- **BUSINESS_RULE_VIOLATION**: Business rule violation
- **EXTERNAL_SERVICE_ERROR**: External service error
- **INTERNAL_ERROR**: Internal server error

## 9. API Rate Limiting

### Rate Limit Headers

All APIs include rate limiting headers:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

### Rate Limit Rules

- **Product Service**: 1000 requests per minute per API key
- **Product Aggregation**: 500 GraphQL queries per minute per user
- **Inventory Service**: 2000 requests per minute per API key
- **Sourcing Service**: 500 requests per minute per API key
- **Product Experience**: 1000 requests per minute per user
- **Configuration Hub**: 100 requests per minute per service

## 10. API Versioning

### Version Strategy

- **URL Versioning**: `/api/v1/`, `/api/v2/`
- **Header Versioning**: `Accept: application/vnd.api.v1+json`
- **Query Parameter**: `?version=1.0`

### Version Compatibility

- **Major Versions**: Breaking changes, require migration
- **Minor Versions**: New features, backward compatible
- **Patch Versions**: Bug fixes, backward compatible

### Deprecation Policy

- **Deprecation Notice**: 6 months advance notice
- **Migration Guide**: Comprehensive migration documentation
- **Support Period**: 12 months after deprecation
