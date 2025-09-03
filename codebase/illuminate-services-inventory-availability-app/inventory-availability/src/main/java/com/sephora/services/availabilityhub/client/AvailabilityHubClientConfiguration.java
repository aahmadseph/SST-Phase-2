package com.sephora.services.availabilityhub.client;

import com.sephora.services.availabilityhub.client.feign.FeignLogger;
import lombok.Data;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;

import feign.Client;
import feign.Feign;
import feign.Logger;
import feign.Request;
import feign.RequestInterceptor;
import feign.Retryer;
import feign.codec.Decoder;
import feign.codec.ErrorDecoder;
import feign.httpclient.ApacheHttpClient;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;
import lombok.extern.log4j.Log4j2;

@ConditionalOnProperty(prefix = "yantriks", name = "enabled", havingValue = "true")
@Configuration
@ConfigurationProperties(prefix = "availabilityhub.client")
@Log4j2
@Data
public class AvailabilityHubClientConfiguration {

	@Autowired
	private ObjectMapper mapper;
	
	@Value("${availabilityhub.client.serviceUrl}")
	private String serviceUrl;
	
	@Value("${availabilityhub.client.customServiceUrl}")
	private String customServiceUrl;
	
	@Value("${availabilityhub.client.readClusterServiceUrl}")
	private String readClusterServiceUrl;

	@Value("${availabilityhub.client.transitServiceUrl}")
	private String transitServiceUrl;

	@Value("${connectionTimeout:5000}")
	private int connectionTimeout;

	@Value("${socketTimeout:5000}")
	private int socketTimeout;

	@Value("${connectionRequestTimeout:5000}")
	private int connectionRequestTimeout;

	@Value("${readTimeout:3000}")
	private int readTimeout;

	@Value("${defaultMaxPerRouteConnections:20}")
	private int defaultMaxPerRouteConnections;

	@Value("${maxTotalConnections:100}")
	private int maxTotalConnections;

	@Value("${retryPeriod:100}")
	private long retryPeriod;

	@Value("${retryMaxPeriod:500}")
	private long retryMaxPeriod;

	@Value("${retryMaxAttempts:3}")
	private int retryMaxAttempts;

	@Value("${inactivityTimeout:180}")
	private int inactivityTimeout;

	@Autowired
	private RequestInterceptor requestInterceptor;

	@Autowired
	private ErrorDecoder errorDecoder;

	@Autowired
	@Qualifier("AvailabilityHubClientRetryer")
	private Retryer retryer;
	
	@Autowired
	@Qualifier("AvailabilityHubClientDecoder")
	private Decoder decoder;

	@Bean
	@RefreshScope
	public AvailabilityHubClient inventoryServiceClient() {
		Request.Options options = new Request.Options(connectionTimeout, readTimeout);

		return Feign.builder().client(createApacheHttpClient())
				//.decoder(decoder)
				.requestInterceptor(requestInterceptor)
                .errorDecoder(errorDecoder)
                .retryer(retryer)
				.encoder(new JacksonEncoder(mapper))
				.logger(new FeignLogger())
				.logLevel(Logger.Level.FULL)
				//.decoder(new JacksonDecoder(mapper))
				.decoder(decoder)
				.options(options)
				.target(AvailabilityHubClient.class, serviceUrl);
	}
	
	@Bean
	@RefreshScope
	public CustomAvailabilityHubClient customInventoryServiceClient() {
		Request.Options options = new Request.Options(connectionTimeout, readTimeout);

		return Feign.builder().client(createApacheHttpClient())
				//.decoder(decoder)
				.requestInterceptor(requestInterceptor)
                .errorDecoder(errorDecoder)
                .retryer(retryer)
				.encoder(new JacksonEncoder(mapper))
				.logger(new FeignLogger())
				.logLevel(Logger.Level.FULL)
				//.decoder(new JacksonDecoder(mapper))
				.decoder(decoder)
				.options(options)
				.target(CustomAvailabilityHubClient.class, customServiceUrl);
	}
	
	@Bean
	@RefreshScope
	public AvailabilityHubReadClusterClient availabilityHubReadClusterClient() {
		Request.Options options = new Request.Options(connectionTimeout, readTimeout);

		return Feign.builder().client(createApacheHttpClient())
				//.decoder(decoder)
				.requestInterceptor(requestInterceptor)
                .errorDecoder(errorDecoder)
                .retryer(retryer)
				.encoder(new JacksonEncoder(mapper))
				.logger(new FeignLogger())
				.logLevel(Logger.Level.FULL)
				//.decoder(new JacksonDecoder(mapper))
				.decoder(decoder)
				.options(options)
				.target(AvailabilityHubReadClusterClient.class, readClusterServiceUrl);
	}

	@Bean
	@RefreshScope
	public TransitServiceClient transitServiceClient() {
		Request.Options options = new Request.Options(connectionTimeout, readTimeout);

		return Feign.builder().client(createApacheHttpClient())
				//.decoder(decoder)
				.requestInterceptor(requestInterceptor)
				.errorDecoder(errorDecoder)
				.retryer(retryer)
				.encoder(new JacksonEncoder(mapper))
				.logger(new FeignLogger())
				.logLevel(Logger.Level.FULL)
				//.decoder(new JacksonDecoder(mapper))
				.decoder(decoder)
				.options(options)
				.target(TransitServiceClient.class, transitServiceUrl);
	}

	@Bean
	public feign.Logger.Level feignLoggerLevel() {
		return Logger.Level.FULL;
	}

	private Retryer createRetryer() {
		return new Retryer.Default(retryPeriod, retryMaxPeriod, retryMaxAttempts);
	}

	private Client createApacheHttpClient() {
		PoolingHttpClientConnectionManager httpClientConnectionManager = new PoolingHttpClientConnectionManager();
		log.info("defaultMaxPerRouteConnections={},maxTotalConnections={}", defaultMaxPerRouteConnections,
				maxTotalConnections);
		httpClientConnectionManager.setDefaultMaxPerRoute(defaultMaxPerRouteConnections);
		httpClientConnectionManager.setMaxTotal(maxTotalConnections);
		httpClientConnectionManager.setValidateAfterInactivity(inactivityTimeout);

		RequestConfig requestConfig = RequestConfig.custom()
				// The time for the server to return data (response) exceeds the throw of read
				// timeout
				.setSocketTimeout(socketTimeout)
				// The time to connect to the server (handshake succeeded) exceeds the throw
				// connect timeout
				.setConnectTimeout(connectionTimeout)
				// The timeout to get the connection from the connection pool. If the connection
				// is not available after the timeout, the following exception will be thrown
				// org.apache.http.conn.ConnectionPoolTimeoutException: Timeout waiting for
				// connection from pool
				.setConnectionRequestTimeout(connectionRequestTimeout).build();

		return new ApacheHttpClient(HttpClientBuilder.create()
				.setDefaultRequestConfig(requestConfig)
				.setConnectionManager(httpClientConnectionManager).build());
	}

	
	public String getServiceUrl() {
		return serviceUrl;
	}

	public void setServiceUrl(String serviceUrl) {
		this.serviceUrl = serviceUrl;
	}

	public String getCustomServiceUrl() {
		return customServiceUrl;
	}

	public void setCustomServiceUrl(String customServiceUrl) {
		this.customServiceUrl = customServiceUrl;
	}

	public int getConnectionTimeout() {
		return connectionTimeout;
	}

	public void setConnectionTimeout(int connectionTimeout) {
		this.connectionTimeout = connectionTimeout;
	}

	
	public int getReadTimeout() {
		return readTimeout;
	}

	public void setReadTimeout(int readTimeout) {
		this.readTimeout = readTimeout;
	}

	
	public int getDefaultMaxPerRouteConnections() {
		return defaultMaxPerRouteConnections;
	}

	public void setDefaultMaxPerRouteConnections(int defaultMaxPerRouteConnections) {
		this.defaultMaxPerRouteConnections = defaultMaxPerRouteConnections;
	}

	
	public int getMaxTotalConnections() {
		return maxTotalConnections;
	}

	public void setMaxTotalConnections(int maxTotalConnections) {
		this.maxTotalConnections = maxTotalConnections;
	}

	
	public long getRetryPeriod() {
		return retryPeriod;
	}

	public void setRetryPeriod(long retryPeriod) {
		this.retryPeriod = retryPeriod;
	}

	
	public long getRetryMaxPeriod() {
		return retryMaxPeriod;
	}

	public void setRetryMaxPeriod(long retryMaxPeriod) {
		this.retryMaxPeriod = retryMaxPeriod;
	}

	
	public int getRetryMaxAttempts() {
		return retryMaxAttempts;
	}

	public void setRetryMaxAttempts(int retryMaxAttempts) {
		this.retryMaxAttempts = retryMaxAttempts;
	}

	
	public int getSocketTimeout() {
		return socketTimeout;
	}

	public void setSocketTimeout(int socketTimeout) {
		this.socketTimeout = socketTimeout;
	}

	
	public int getConnectionRequestTimeout() {
		return connectionRequestTimeout;
	}

	public void setConnectionRequestTimeout(int connectionRequestTimeout) {
		this.connectionRequestTimeout = connectionRequestTimeout;
	}

	
	public int getInactivityTimeout() {
		return inactivityTimeout;
	}

	public void setInactivityTimeout(int inactivityTimeout) {
		this.inactivityTimeout = inactivityTimeout;
	}
}
