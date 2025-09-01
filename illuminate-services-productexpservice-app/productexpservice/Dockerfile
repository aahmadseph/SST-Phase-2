FROM artifactory.lipstack.sephoraus.com/goldenimage-java-openjdk11/final:latest

# We added a VOLUME pointing to "/tmp" because that is where a Spring Boot application creates working directories
# for Tomcat by default. The effect is to create a temporary file on your host under "/var/lib/docker" and link
# it to the container under "/tmp".
VOLUME /tmp

ARG DEPENDENCY=target/dependency
COPY ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY ${DEPENDENCY}/META-INF /app/META-INF
COPY ${DEPENDENCY}/BOOT-INF/classes /app
EXPOSE 8080

CMD java $JAVA_ADDITIONAL_OPTS -cp app:app/lib/* com.sephora.productexpservice.ProductexpserviceApplication