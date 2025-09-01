FROM artifactory.lipstack.sephoraus.com/goldenimage-java-openjdk17/final:latest

ENV JAVA_TOOL_OPTIONS \
  -Dlog4j2.contextSelector=org.apache.logging.log4j.core.async.AsyncLoggerContextSelector \
  # -XX:+UseG1GC \ https://developers.redhat.com/articles/2022/04/19/java-17-whats-new-openjdks-container-awareness#recent_changes_in_openjdk_s_container_awareness_code
  # cgroups v2 support select right GC depending on
  -XX:MaxGCPauseMillis=200 \
  -XX:NewRatio=3 \
  -XX:InitiatingHeapOccupancyPercent=70 \
  -XX:SurvivorRatio=2 \
  -XX:ParallelGCThreads=20 \
  -XX:ConcGCThreads=5 \
  -XX:+ExitOnOutOfMemoryError \
  -XX:InitialRAMPercentage=50.0 -XX:MinRAMPercentage=70.0 -XX:TieredStopAtLevel=1

ARG DEPENDENCY=target/dependency
COPY ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY ${DEPENDENCY}/META-INF /app/META-INF
COPY ${DEPENDENCY}/BOOT-INF/classes /app
EXPOSE 8080

CMD java $JAVA_ADDITIONAL_OPTS -cp app:app/lib/* com.sephora.services.productaggregationservice.productaggregationservice.ProductAggregationServiceApplication