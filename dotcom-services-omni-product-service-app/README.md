# Omni product service

## Installation

1. Get **Open jdk 21** (https://adoptium.net/temurin/releases/)
2. Install it and make **JAVA_HOME** point to **Java 21 JDK** directory.
3. Get **Apache Maven 3** (https://archive.apache.org/dist/maven/maven-3). Recommended version **3.9.2**
4. Install it and make **M2_HOME** point to **Apache Maven 3** directory.

## Build project

### For build project use next command

```x-sh
mvn clean package
```

### For build project on docker use next command

```x-sh
docker run -it --rm --name my-maven-project -v "$PWD":/usr/src/app -v "$HOME"/.m2:/root/.m2 -w /usr/src/app maven:3.9.7-eclipse-temurin-21 mvn clean install
```

## Run application

1. Run with using spring-boot maven plugin
   ```x-sh
   spring-boot:run -f ./omni-product-service/pom.xml
    ```
2. For support debug (port 5006) run spring-boot maven plugin and 'local' profile
   ```x-sh
   spring-boot:run -f ./omni-product-service/pom.xml -P local
    ```

## Swagger

After start service swagger JSON configuration available **http://localhost:8080/omni-product-service/v3/api-docs**

Swagger UI available **http://localhost:8080/omni-product-service/swagger-ui.html**

## Ggraphiql

The graphiql available **http://localhost:8080/omni-product-service/graphiql**

## Docker

1. Install docker https://docs.docker.com/install/
2. Build project with profile 'docker'
    ```x-sh
    mvn clean install -P docker,local  
    ```
   The docker image will be created with name **'omni-product-service/${git.branch}'** and version as commit hash. For example *
   *'2aef82643c98'**
3. Create and start docker container
    * Create docker container for 'local' spring profile. The detailed configuration for container defined on pom.xml
    ```x-sh
    mvn git-commit-id:revision docker:run -P local,docker -f ./omni-product-service/pom.xml 
    ``` 
   **PLEASE NOTE: Application will be started with support debug mode**
4. Output log for docker container
    ```x-sh
    mvn git-commit-id:revision docker:logs -Ddocker.follow -Ddocker.logDate=DEFAULT -P local,docker -f ./omni-product-service/pom.xml 
    ```
5. Subgraph check (https://www.apollographql.com/docs/rover/getting-started#linux--macos-installer)
   - Install rover cli
      ```x-sh
      curl -sSL https://rover.apollo.dev/nix/latest | sh
      ```
   - Set env variable for rover(generate your Apollo key at https://studio.apollographql.com/user-settings/api-keys)
      ```x-sh
      export export APOLLO_KEY="<your-apollo-key>"
      ```
   - To check subgraph use the following command:
      ```x-sh
      rover subgraph check Sephora-Enterprise-Graph@qa --schema /./omni-product-service/src/main/resources/schema/schema.graphqls --name omni-product-service
      ```

### TODO:
1. Add support refresh ahead for cache2k for product type cache
2. Check Redis cache solution. Some time response from redis not correspond to object which set to redis
3. Add support for bulk cache loader for Redis cache
4. Thinking about overloading CT productProjection object with some improvement. For example hold productVariant on map instead of list.
5. Investigate solution for using Redis JSON concept as layer between app and CT
6. Add separate property fetcher for properties:
   - SkuDetails.fullSizeSku (use 'fullSizeSkuId')
   - SkuDetails.originalSampleProduct (use 'originalSampleProductId' property)
7. Analyze performance and optimize cache. 
8. Add support cache invalidation by event from CT
   - Create separate Kafka topic
   - Add Subscription on CT side
   - Handle kafka event and invalidate cache
   - Add support for cache invalidation between pods
9. Investigate cache solution with hazelcast cache instead of Redis. This will be separate pod on app.
10. Make limits for CT repositories configurable
11. Analyze logic for nonsellable about reassign fields from originalSampleProduct. For example 'brand', 'categories' etc.
