package com.sephora.services.sourcingoptions.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sephora.services.sourcingoptions.client.logger.FeignLogger;
import feign.*;
import feign.codec.Decoder;
import feign.codec.ErrorDecoder;
import feign.httpclient.ApacheHttpClient;
import feign.jackson.JacksonEncoder;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.binder.httpcomponents.MicrometerHttpRequestExecutor;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
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

import java.util.concurrent.TimeUnit;

@ConditionalOnProperty(prefix = "availabilityhub", name = "enabled", havingValue = "true")
@Configuration
@ConfigurationProperties(prefix = "availabilityhub.client")
@Log4j2
public class AvailabilityHubClientConfiguration {

	@Autowired
	private ObjectMapper mapper;

	private String serviceUrl;

	private String commonServiceUrl;
	
	@Getter
	@Setter
    private String customInventoryUrl;

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

	@Value("${retryMaxAttempts:1}")
	private int retryMaxAttempts;

	@Value("${inactivityTimeout:180}")
	private int inactivityTimeout;

	@Autowired
	private RequestInterceptor requestInterceptor;

	@Autowired
	private ErrorDecoder errorDecoder;

	@Autowired
	@Qualifier("AvailabilityHubClientDecoder")
	private Decoder decoder;

	@Autowired
	@Qualifier("AvailabilityHubClientRetryer")
	private Retryer retryer;
	
	@Autowired
    private MeterRegistry micrometerRegistry;

	@Autowired
	private Logger.Level feignLoggerLevel;

	@Bean
	@RefreshScope
	public AvailabilityHubClient availabilityHubClient() {
		Request.Options options = new Request.Options(connectionTimeout, readTimeout);

		return Feign.builder().client(createApacheHttpClient()).requestInterceptor(requestInterceptor)
				.errorDecoder(errorDecoder).retryer(retryer).logger(new FeignLogger()).logLevel(feignLoggerLevel)
				.encoder(new JacksonEncoder(mapper)).decoder(decoder).options(options)
				.target(AvailabilityHubClient.class, serviceUrl);
	}

	@Bean
	@RefreshScope
	public AvailabilityHubCommonClient availabilityHubCommonClient() {
		Request.Options options = new Request.Options(connectionTimeout, readTimeout);
		return Feign.builder().client(createApacheHttpClient()).requestInterceptor(requestInterceptor)
				.errorDecoder(errorDecoder).retryer(retryer).logger(new FeignLogger()).logLevel(feignLoggerLevel)
				.encoder(new JacksonEncoder(mapper)).decoder(decoder).options(options)
				.target(AvailabilityHubCommonClient.class, commonServiceUrl);
	}
	
	@Bean
	@RefreshScope
	public AvailabilityHubCustomInventoryClient availabilityHubCustomInventory() {
		Request.Options options = new Request.Options(connectionTimeout, readTimeout);
		
		return Feign.builder().client(createApacheHttpClient()).requestInterceptor(requestInterceptor)
				.errorDecoder(errorDecoder).retryer(retryer).logger(new FeignLogger()).logLevel(feignLoggerLevel)
				.encoder(new JacksonEncoder(mapper)).decoder(decoder).options(options)
				.target(AvailabilityHubCustomInventoryClient.class, customInventoryUrl);
	}


	/*@Bean
	public Logger.Level feignLoggerLevel() {
		return Logger.Level.BASIC;
	}*/

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
		
		
		// Use micrometer metrics generator request executor so that we can capture metrics and dashboard it - 
		// Disabling below executer object creation since this is causing distinct actualtor logs for every request sinc e correlationIds are also coming along with it.
		/*
        MicrometerHttpRequestExecutor executor = MicrometerHttpRequestExecutor.builder(micrometerRegistry).exportTagsForRoute(true)
        										.uriMapper(req -> req.getRequestLine().getUri())
        										.build();
        
		return new ApacheHttpClient(HttpClientBuilder.create().setDefaultRequestConfig(requestConfig)
				.setRequestExecutor(executor)
				.setConnectionManager(httpClientConnectionManager).build());
		*/		
		return new ApacheHttpClient(HttpClientBuilder.create().setDefaultRequestConfig(requestConfig)
				.evictIdleConnections((long) inactivityTimeout, TimeUnit.MILLISECONDS)
				.setConnectionManager(httpClientConnectionManager).build());
	}

	public String getServiceUrl() {
		return serviceUrl;
	}

	public void setServiceUrl(String serviceUrl) {
		this.serviceUrl = serviceUrl;
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

	public String getCommonServiceUrl() {
		return commonServiceUrl;
	}

	public void setCommonServiceUrl(String commonServiceUrl) {
		this.commonServiceUrl = commonServiceUrl;
	}
}