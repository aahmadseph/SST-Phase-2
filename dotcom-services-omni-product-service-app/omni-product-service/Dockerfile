FROM artifactory.lipstack.sephoraus.com/goldenimage-java-openjdk21/final:latest AS builder

USER appuser

WORKDIR /app
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} application.jar

RUN java -Djarmode=tools -jar application.jar extract --layers --launcher --destination ./app

FROM artifactory.lipstack.sephoraus.com/goldenimage-java-openjdk21/final:latest

WORKDIR /app
COPY --from=builder /app/app/dependencies/ ./
COPY --from=builder /app/app/spring-boot-loader/ ./
COPY --from=builder /app/app/snapshot-dependencies/ ./
COPY --from=builder /app/app/application/ ./

RUN rm -f  ./BOOT-INF/classes/*-local.yaml
RUN rm -f  ./BOOT-INF/classes/*-local.xml

EXPOSE 8080

# Overide JAVA_TOOL_OPTIONS for avoid unnecesary arg from Golden Image
ENV JAVA_TOOL_OPTIONS \
-XX:MaxGCPauseMillis=120 \
-XX:-G1UseAdaptiveIHOP \
-XX:InitiatingHeapOccupancyPercent=65 \
-XX:SurvivorRatio=2 \
-XX:ParallelGCThreads=10 \
-XX:ConcGCThreads=5 \
-XX:+UseG1GC \
-XX:+UnlockDiagnosticVMOptions \
-XX:GCLockerRetryAllocationCount=75 \
-XX:MaxRAMPercentage=75

ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]