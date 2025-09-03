# High-Level Software Architecture

## Overview
This document provides a comprehensive analysis of the high-level software architecture for the Sephora Vibe SST-Phase-2 system, based on the actual codebase implementation.

## System Architecture

### Core Services Architecture
The system follows a microservices architecture pattern with the following main components:

```mermaid
graph TB
    subgraph "Frontend Layer"
        UFE[illuminate-frontend-ufe<br/>Frontend Application]
    end
    
    subgraph "Core Business Services"
        OPS[dotcom-services-omni-product-service-app<br/>Product Service]
        PAS[dotcom-services-product-aggregation-service-app<br/>Product Aggregation]
        IAS[illuminate-services-inventory-availability-app<br/>Inventory & Availability]
        SS[illuminate-services-sourcing-service-app<br/>Sourcing Service]
        PES[illuminate-services-productexpservice-app<br/>Product Experience]
    end
    
    subgraph "Configuration & Infrastructure"
        CH[dotcom-services-confighub-app<br/>Configuration Hub]
    end
    
    UFE --> OPS
    UFE --> PAS
    UFE --> IAS
    UFE --> SS
    UFE --> PES
    OPS --> CH
    PAS --> CH
    IAS --> CH
    SS --> CH
    PES --> CH
```

### Service Categories

#### 1. Frontend Services
- **illuminate-frontend-ufe**: Main frontend application with React-based UI components

#### 2. Product Management Services
- **dotcom-services-omni-product-service-app**: Core product service with Commerce Tools integration
- **dotcom-services-product-aggregation-service-app**: Product aggregation and GraphQL API
- **illuminate-services-productexpservice-app**: Product experience service

#### 3. Operational Services
- **illuminate-services-inventory-availability-app**: Inventory and availability management
- **illuminate-services-sourcing-service-app**: Sourcing and procurement services

#### 4. Infrastructure Services
- **dotcom-services-confighub-app**: Centralized configuration management

## Technology Stack

### Backend Technologies
- **Java**: Primary backend language for microservices
- **Spring Boot**: Framework for microservices
- **Maven**: Build and dependency management
- **Docker**: Containerization

### Frontend Technologies
- **React**: Main UI framework
- **Node.js**: Server-side rendering and build tools
- **Webpack**: Module bundling
- **ES6+**: Modern JavaScript features

### Data & APIs
- **GraphQL**: Product aggregation service API
- **REST APIs**: Traditional service endpoints
- **Commerce Tools**: External e-commerce platform integration

### Infrastructure
- **Docker**: Container orchestration
- **Jenkins**: CI/CD pipeline
- **SonarQube**: Code quality analysis

## Architecture Patterns

### Microservices Pattern
- Each service is independently deployable
- Services communicate via well-defined APIs
- Independent scaling and deployment

### API Gateway Pattern
- Frontend communicates with backend services through defined interfaces
- Service discovery and routing

### Configuration Management
- Centralized configuration through confighub service
- Environment-specific configurations

### Event-Driven Architecture
- Services can communicate asynchronously
- Loose coupling between services

## Deployment Architecture

```mermaid
graph LR
    subgraph "Client Layer"
        Browser[Web Browser]
        Mobile[Mobile App]
    end
    
    subgraph "Load Balancer"
        LB[Load Balancer]
    end
    
    subgraph "Frontend Layer"
        UFE_Instance1[UFE Instance 1]
        UFE_Instance2[UFE Instance 2]
    end
    
    subgraph "Service Layer"
        OPS_Instance1[OPS Instance 1]
        OPS_Instance2[OPS Instance 2]
        PAS_Instance1[PAS Instance 1]
        IAS_Instance1[IAS Instance 1]
    end
    
    subgraph "Data Layer"
        DB1[(Database 1)]
        DB2[(Database 2)]
        Cache[(Cache)]
    end
    
    Browser --> LB
    Mobile --> LB
    LB --> UFE_Instance1
    LB --> UFE_Instance2
    UFE_Instance1 --> OPS_Instance1
    UFE_Instance1 --> PAS_Instance1
    UFE_Instance2 --> OPS_Instance2
    UFE_Instance2 --> IAS_Instance1
    OPS_Instance1 --> DB1
    PAS_Instance1 --> DB2
    IAS_Instance1 --> Cache
```

## Security Architecture

### Authentication & Authorization
- Service-to-service authentication
- API security through proper authentication mechanisms
- Role-based access control

### Data Security
- Encrypted data transmission
- Secure configuration management
- Audit logging

## Scalability Considerations

### Horizontal Scaling
- Multiple instances of each service
- Load balancing across instances
- Stateless service design

### Performance Optimization
- Caching strategies
- Database optimization
- CDN for static assets

## Monitoring & Observability

### Health Checks
- Service health monitoring
- Dependency health checks
- Performance metrics

### Logging
- Centralized logging
- Structured logging format
- Log aggregation and analysis

## Integration Points

### External Systems
- Commerce Tools platform
- Payment gateways
- Inventory systems

### Internal Services
- Service-to-service communication
- Event-driven messaging
- Shared data models
