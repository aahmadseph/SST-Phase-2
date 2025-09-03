# Detailed Software Diagrams with Dependencies

## Overview
This document provides detailed software diagrams for each service in the Sephora Vibe SST-Phase-2 system, showing internal architecture, components, and dependencies.

## 1. Frontend Application Architecture

### illuminate-frontend-ufe Structure

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        Mobile[Mobile App]
    end
    
    subgraph "Frontend Application - illuminate-frontend-ufe"
        subgraph "UI Components"
            React[React Components]
            Router[React Router]
            State[State Management]
        end
        
        subgraph "Build & Build Tools"
            Webpack[Webpack Bundler]
            Babel[Babel Transpiler]
            ESLint[ESLint]
            Prettier[Prettier]
        end
        
        subgraph "Server-Side Rendering"
            NodeJS[Node.js Server]
            SSR[SSR Engine]
        end
        
        subgraph "Development Tools"
            HotReload[Hot Reload]
            DevTools[Developer Tools]
        end
    end
    
    subgraph "External Dependencies"
        NPM[NPM Packages]
        CDN[CDN Assets]
    end
    
    Browser --> React
    Mobile --> React
    React --> Router
    React --> State
    Webpack --> React
    Babel --> Webpack
    NodeJS --> SSR
    SSR --> React
    NPM --> Webpack
    CDN --> Webpack
```

### Frontend Component Dependencies

```mermaid
graph LR
    subgraph "Core Components"
        App[App Component]
        Header[Header Component]
        Footer[Footer Component]
        Navigation[Navigation Component]
    end
    
    subgraph "Feature Components"
        ProductList[Product List]
        ProductDetail[Product Detail]
        Cart[Shopping Cart]
        Checkout[Checkout]
        UserProfile[User Profile]
    end
    
    subgraph "Shared Components"
        Button[Button Component]
        Modal[Modal Component]
        Form[Form Components]
        Loading[Loading Component]
    end
    
    App --> Header
    App --> Navigation
    App --> ProductList
    App --> ProductDetail
    App --> Cart
    App --> Checkout
    App --> Footer
    
    ProductList --> Button
    ProductDetail --> Button
    Cart --> Modal
    Checkout --> Form
    UserProfile --> Form
    
    Header --> Navigation
    Navigation --> ProductList
    ProductList --> ProductDetail
    ProductDetail --> Cart
    Cart --> Checkout
```

## 2. Product Service Architecture

### dotcom-services-omni-product-service-app Structure

```mermaid
graph TB
    subgraph "Product Service - dotcom-services-omni-product-service-app"
        subgraph "API Layer"
            REST[REST Controllers]
            GraphQL[GraphQL Resolvers]
            Validation[Request Validation]
        end
        
        subgraph "Business Logic Layer"
            ProductLogic[Product Business Logic]
            PricingLogic[Pricing Logic]
            InventoryLogic[Inventory Logic]
            CommerceToolsAdapter[Commerce Tools Adapter]
        end
        
        subgraph "Data Access Layer"
            ProductRepo[Product Repository]
            PricingRepo[Pricing Repository]
            InventoryRepo[Inventory Repository]
            ConfigRepo[Configuration Repository]
        end
        
        subgraph "External Integrations"
            CT_Client[Commerce Tools Client]
            PaymentClient[Payment Gateway Client]
            ConfigClient[Configuration Hub Client]
        end
        
        subgraph "Infrastructure"
            Database[(Database)]
            Cache[(Cache)]
            MessageQueue[Message Queue]
        end
    end
    
    REST --> ProductLogic
    GraphQL --> ProductLogic
    ProductLogic --> ProductRepo
    ProductLogic --> PricingLogic
    ProductLogic --> InventoryLogic
    PricingLogic --> PricingRepo
    InventoryLogic --> InventoryRepo
    
    ProductLogic --> CommerceToolsAdapter
    CommerceToolsAdapter --> CT_Client
    ProductLogic --> PaymentClient
    ProductLogic --> ConfigClient
    
    ProductRepo --> Database
    PricingRepo --> Database
    InventoryRepo --> Database
    ConfigRepo --> Database
    
    ProductLogic --> Cache
    ProductLogic --> MessageQueue
```

### Commerce Tools Adapter Dependencies

```mermaid
graph LR
    subgraph "Commerce Tools Adapter"
        CT_Service[Commerce Tools Service]
        CT_Config[CT Configuration]
        CT_Client[CT HTTP Client]
    end
    
    subgraph "External Commerce Tools"
        CT_API[Commerce Tools API]
        CT_Auth[CT Authentication]
        CT_Webhooks[CT Webhooks]
    end
    
    subgraph "Internal Dependencies"
        ProductService[Product Service]
        ConfigService[Configuration Service]
        LoggingService[Logging Service]
    end
    
    ProductService --> CT_Service
    CT_Service --> CT_Config
    CT_Service --> CT_Client
    CT_Client --> CT_API
    CT_Client --> CT_Auth
    CT_Service --> CT_Webhooks
    
    CT_Service --> ConfigService
    CT_Service --> LoggingService
```

## 3. Product Aggregation Service Architecture

### dotcom-services-product-aggregation-service-app Structure

```mermaid
graph TB
    subgraph "Product Aggregation Service - dotcom-services-product-aggregation-service-app"
        subgraph "GraphQL Layer"
            Schema[GraphQL Schema]
            Resolvers[GraphQL Resolvers]
            DataLoaders[Data Loaders]
        end
        
        subgraph "Aggregation Layer"
            ProductAggregator[Product Aggregator]
            InventoryAggregator[Inventory Aggregator]
            PricingAggregator[Pricing Aggregator]
            SearchAggregator[Search Aggregator]
        end
        
        subgraph "Data Sources"
            ProductService[Product Service Client]
            InventoryService[Inventory Service Client]
            PricingService[Pricing Service Client]
            SearchService[Search Service Client]
        end
        
        subgraph "Caching & Performance"
            RedisCache[Redis Cache]
            QueryCache[Query Cache]
            ResponseCache[Response Cache]
        end
        
        subgraph "Infrastructure"
            Database[(Database)]
            Monitoring[Monitoring]
            Logging[Logging]
        end
    end
    
    Schema --> Resolvers
    Resolvers --> DataLoaders
    DataLoaders --> ProductAggregator
    DataLoaders --> InventoryAggregator
    DataLoaders --> PricingAggregator
    DataLoaders --> SearchAggregator
    
    ProductAggregator --> ProductService
    InventoryAggregator --> InventoryService
    PricingAggregator --> PricingService
    SearchAggregator --> SearchService
    
    ProductAggregator --> RedisCache
    InventoryAggregator --> RedisCache
    PricingAggregator --> RedisCache
    SearchAggregator --> RedisCache
    
    QueryCache --> Resolvers
    ResponseCache --> Resolvers
    
    ProductAggregator --> Database
    Monitoring --> Resolvers
    Logging --> Resolvers
```

## 4. Inventory & Availability Service Architecture

### illuminate-services-inventory-availability-app Structure

```mermaid
graph TB
    subgraph "Inventory Service - illuminate-services-inventory-availability-app"
        subgraph "API Layer"
            REST_API[REST API Controllers]
            GraphQL_API[GraphQL API]
            HealthCheck[Health Check Endpoints]
        end
        
        subgraph "Business Logic Layer"
            InventoryManager[Inventory Manager]
            AvailabilityCalculator[Availability Calculator]
            StockLevelManager[Stock Level Manager]
            ReservationManager[Reservation Manager]
        end
        
        subgraph "Data Processing"
            DataTransformer[Data Transformer]
            CacheManager[Cache Manager]
            EventPublisher[Event Publisher]
        end
        
        subgraph "External Integrations"
            ExternalInventory[External Inventory Systems]
            WarehouseSystems[Warehouse Management]
            ConfigHub[Configuration Hub]
        end
        
        subgraph "Data Storage"
            InventoryDB[(Inventory Database)]
            Cache[(Redis Cache)]
            EventStore[(Event Store)]
        end
        
        subgraph "Infrastructure"
            MessageQueue[Message Queue]
            Monitoring[Monitoring]
            Logging[Logging]
        end
    end
    
    REST_API --> InventoryManager
    GraphQL_API --> InventoryManager
    HealthCheck --> InventoryManager
    
    InventoryManager --> AvailabilityCalculator
    InventoryManager --> StockLevelManager
    InventoryManager --> ReservationManager
    
    AvailabilityCalculator --> DataTransformer
    StockLevelManager --> DataTransformer
    ReservationManager --> DataTransformer
    
    DataTransformer --> CacheManager
    DataTransformer --> EventPublisher
    
    InventoryManager --> ExternalInventory
    InventoryManager --> WarehouseSystems
    InventoryManager --> ConfigHub
    
    DataTransformer --> InventoryDB
    CacheManager --> Cache
    EventPublisher --> EventStore
    
    EventPublisher --> MessageQueue
    Monitoring --> InventoryManager
    Logging --> InventoryManager
```

## 5. Sourcing Service Architecture

### illuminate-services-sourcing-service-app Structure

```mermaid
graph TB
    subgraph "Sourcing Service - illuminate-services-sourcing-service-app"
        subgraph "API Layer"
            SourcingAPI[Sourcing API Controllers]
            SupplierAPI[Supplier API Controllers]
            ContractAPI[Contract API Controllers]
        end
        
        subgraph "Business Logic Layer"
            SourcingManager[Sourcing Manager]
            SupplierManager[Supplier Manager]
            ContractManager[Contract Manager]
            CostOptimizer[Cost Optimizer]
        end
        
        subgraph "Data Processing"
            DataProcessor[Data Processor]
            ValidationEngine[Validation Engine]
            WorkflowEngine[Workflow Engine]
        end
        
        subgraph "External Integrations"
            SupplierSystems[External Supplier Systems]
            ProcurementTools[Procurement Tools]
            ConfigHub[Configuration Hub]
        end
        
        subgraph "Data Storage"
            SourcingDB[(Sourcing Database)]
            SupplierDB[(Supplier Database)]
            ContractDB[(Contract Database)]
        end
        
        subgraph "Infrastructure"
            MessageQueue[Message Queue]
            Monitoring[Monitoring]
            Logging[Logging]
        end
    end
    
    SourcingAPI --> SourcingManager
    SupplierAPI --> SupplierManager
    ContractAPI --> ContractManager
    
    SourcingManager --> CostOptimizer
    SupplierManager --> CostOptimizer
    ContractManager --> CostOptimizer
    
    SourcingManager --> DataProcessor
    SupplierManager --> DataProcessor
    ContractManager --> DataProcessor
    
    DataProcessor --> ValidationEngine
    DataProcessor --> WorkflowEngine
    
    SourcingManager --> SupplierSystems
    SupplierManager --> ProcurementTools
    ContractManager --> ConfigHub
    
    DataProcessor --> SourcingDB
    DataProcessor --> SupplierDB
    DataProcessor --> ContractDB
    
    WorkflowEngine --> MessageQueue
    Monitoring --> SourcingManager
    Logging --> SourcingManager
```

## 6. Product Experience Service Architecture

### illuminate-services-productexpservice-app Structure

```mermaid
graph TB
    subgraph "Product Experience Service - illuminate-services-productexpservice-app"
        subgraph "API Layer"
            ExperienceAPI[Experience API Controllers]
            PersonalizationAPI[Personalization API]
            RecommendationAPI[Recommendation API]
        end
        
        subgraph "Business Logic Layer"
            ExperienceManager[Experience Manager]
            PersonalizationEngine[Personalization Engine]
            RecommendationEngine[Recommendation Engine]
            ContentManager[Content Manager]
        end
        
        subgraph "Data Processing"
            UserBehaviorAnalyzer[User Behavior Analyzer]
            ContentOptimizer[Content Optimizer]
            A_B_Testing[A/B Testing Engine]
        end
        
        subgraph "External Integrations"
            UserProfileService[User Profile Service]
            AnalyticsService[Analytics Service]
            ConfigHub[Configuration Hub]
        end
        
        subgraph "Data Storage"
            ExperienceDB[(Experience Database)]
            UserBehaviorDB[(User Behavior Database)]
            ContentDB[(Content Database)]
        end
        
        subgraph "Infrastructure"
            Cache[(Cache)]
            MessageQueue[Message Queue]
            Monitoring[Monitoring]
        end
    end
    
    ExperienceAPI --> ExperienceManager
    PersonalizationAPI --> PersonalizationEngine
    RecommendationAPI --> RecommendationEngine
    
    ExperienceManager --> ContentManager
    PersonalizationEngine --> UserBehaviorAnalyzer
    RecommendationEngine --> UserBehaviorAnalyzer
    
    UserBehaviorAnalyzer --> ContentOptimizer
    ContentOptimizer --> A_B_Testing
    
    ExperienceManager --> UserProfileService
    PersonalizationEngine --> AnalyticsService
    RecommendationEngine --> ConfigHub
    
    UserBehaviorAnalyzer --> UserBehaviorDB
    ContentOptimizer --> ContentDB
    ExperienceManager --> ExperienceDB
    
    ExperienceManager --> Cache
    A_B_Testing --> MessageQueue
    Monitoring --> ExperienceManager
```

## 7. Configuration Hub Architecture

### dotcom-services-confighub-app Structure

```mermaid
graph TB
    subgraph "Configuration Hub - dotcom-services-confighub-app"
        subgraph "API Layer"
            ConfigAPI[Configuration API]
            AdminAPI[Admin API]
            HealthAPI[Health API]
        end
        
        subgraph "Configuration Management"
            ConfigManager[Configuration Manager]
            ConfigValidator[Configuration Validator]
            ConfigVersioning[Configuration Versioning]
            ConfigEncryption[Configuration Encryption]
        end
        
        subgraph "Storage Layer"
            ConfigDB[(Configuration Database)]
            ConfigCache[(Configuration Cache)]
            ConfigBackup[(Configuration Backup)]
        end
        
        subgraph "Security Layer"
            Authentication[Authentication Service]
            Authorization[Authorization Service]
            AuditLogging[Audit Logging]
        end
        
        subgraph "Integration Layer"
            ServiceRegistry[Service Registry]
            ConfigSync[Configuration Synchronization]
            NotificationService[Notification Service]
        end
        
        subgraph "Infrastructure"
            MessageQueue[Message Queue]
            Monitoring[Monitoring]
            Logging[Logging]
        end
    end
    
    ConfigAPI --> ConfigManager
    AdminAPI --> ConfigManager
    HealthAPI --> ConfigManager
    
    ConfigManager --> ConfigValidator
    ConfigManager --> ConfigVersioning
    ConfigManager --> ConfigEncryption
    
    ConfigValidator --> ConfigDB
    ConfigVersioning --> ConfigDB
    ConfigEncryption --> ConfigDB
    
    ConfigManager --> ConfigCache
    ConfigManager --> ConfigBackup
    
    ConfigAPI --> Authentication
    AdminAPI --> Authorization
    ConfigManager --> AuditLogging
    
    ConfigManager --> ServiceRegistry
    ConfigManager --> ConfigSync
    ConfigManager --> NotificationService
    
    ConfigSync --> MessageQueue
    Monitoring --> ConfigManager
    Logging --> ConfigManager
```

## 8. Cross-Service Dependencies Summary

### Service Communication Patterns

```mermaid
graph TB
    subgraph "Frontend Layer"
        UFE[Frontend Application]
    end
    
    subgraph "API Gateway"
        Gateway[API Gateway]
    end
    
    subgraph "Core Services"
        OPS[Product Service]
        PAS[Product Aggregation]
        IAS[Inventory Service]
        SS[Sourcing Service]
        PES[Product Experience]
        CH[Configuration Hub]
    end
    
    subgraph "External Systems"
        CT[Commerce Tools]
        Payment[Payment Gateway]
        Inventory[External Inventory]
    end
    
    UFE --> Gateway
    Gateway --> OPS
    Gateway --> PAS
    Gateway --> IAS
    Gateway --> SS
    Gateway --> PES
    
    OPS --> CH
    PAS --> CH
    IAS --> CH
    SS --> CH
    PES --> CH
    
    OPS --> CT
    OPS --> Payment
    IAS --> Inventory
    SS --> Inventory
    
    PAS --> OPS
    PAS --> IAS
    PAS --> SS
    
    PES --> PAS
```

### Data Flow Between Services

```mermaid
graph LR
    subgraph "Data Sources"
        CT[Commerce Tools]
        External[External Systems]
        User[User Input]
    end
    
    subgraph "Data Processing Services"
        OPS[Product Service]
        IAS[Inventory Service]
        SS[Sourcing Service]
    end
    
    subgraph "Data Aggregation"
        PAS[Product Aggregation]
    end
    
    subgraph "Data Consumption"
        UFE[Frontend]
        PES[Product Experience]
    end
    
    subgraph "Configuration"
        CH[Configuration Hub]
    end
    
    CT --> OPS
    External --> IAS
    External --> SS
    User --> UFE
    
    OPS --> PAS
    IAS --> PAS
    SS --> PAS
    
    PAS --> UFE
    PAS --> PES
    
    CH --> OPS
    CH --> IAS
    CH --> SS
    CH --> PAS
    CH --> PES
```

## 9. Component Dependencies Analysis

### High Coupling Components
1. **Configuration Hub**: All services depend on it
2. **Product Aggregation Service**: Depends on multiple other services
3. **Frontend Application**: Depends on all backend services

### Medium Coupling Components
1. **Product Service**: Depends on Commerce Tools and Configuration Hub
2. **Inventory Service**: Depends on external systems and Configuration Hub
3. **Sourcing Service**: Depends on external systems and Configuration Hub

### Low Coupling Components
1. **Product Experience Service**: Minimal dependencies on other services
2. **Configuration Hub**: Self-contained with minimal external dependencies

## 10. Dependency Management Strategies

### Service Discovery
- **Dynamic Service Location**: Services can discover each other at runtime
- **Load Balancing**: Distribute requests across multiple service instances
- **Health Checks**: Monitor service health and availability

### Circuit Breaker Pattern
- **Fault Tolerance**: Prevent cascading failures
- **Fallback Mechanisms**: Graceful degradation when services are unavailable
- **Monitoring**: Track service health and performance

### Caching Strategy
- **Distributed Caching**: Share cache across service instances
- **Cache Invalidation**: Maintain data consistency
- **Performance Optimization**: Reduce response times and load
