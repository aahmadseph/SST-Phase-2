package com.sephora.services.product.service.commercetools.config;

import com.commercetools.api.models.category.CategoryReference;
import com.commercetools.api.models.category.CategoryReferenceImpl;
import com.commercetools.api.models.common.LocalizedString;
import com.commercetools.api.models.common.LocalizedStringImpl;
import com.commercetools.api.models.product.ProductProjection;
import com.commercetools.api.models.product.ProductProjectionImpl;
import com.commercetools.api.models.product_type.ProductType;
import com.commercetools.api.models.product_type.ProductTypeImpl;
import com.commercetools.api.models.product_type.ProductTypeReference;
import com.commercetools.api.models.product_type.ProductTypeReferenceImpl;
import com.esotericsoftware.kryo.serializers.DefaultSerializers;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.sephora.services.product.service.commercetools.cache.serializer.KryoCustomizer;
import com.sephora.services.product.service.commercetools.cache.serializer.KryoRedisSerializer;
import com.sephora.services.product.service.commercetools.config.properties.ExtendedRedisCacheProperties;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.BooleanUtils;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ResourceLoader;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.JdkSerializationRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;

@ConditionalOnProperty(name = "sephora.cache.redis.enabled")
@Component
@RequiredArgsConstructor
public class RedisSerializerProvider {

    private GenericJackson2JsonRedisSerializer genericJackson2JsonRedisSerializer;

    public RedisSerializer<Object> getSerializer(ExtendedRedisCacheProperties redisCacheProperties) {
        if (BooleanUtils.isTrue(redisCacheProperties.getEnableKryo())) {
            return new KryoRedisSerializer<>(kryoCustomizer(),
                    BooleanUtils.isTrue(redisCacheProperties.getEnableCompression()));
        } else {
            return getGenericJackson2JsonRedisSerializer();
        }
    }

    public GenericJackson2JsonRedisSerializer getGenericJackson2JsonRedisSerializer() {
        if (genericJackson2JsonRedisSerializer == null) {
            genericJackson2JsonRedisSerializer = genericJackson2JsonRedisSerializer();
        }
        return genericJackson2JsonRedisSerializer;
    }

    public GenericJackson2JsonRedisSerializer genericJackson2JsonRedisSerializer() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        objectMapper.configure(DeserializationFeature.FAIL_ON_INVALID_SUBTYPE, false);
        // dateTime , JSR310 LocalDateTimeSerializer
        objectMapper.configure(SerializationFeature.WRITE_DATE_KEYS_AS_TIMESTAMPS, false);
        // Exclude null on serialization
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        objectMapper.configure(DeserializationFeature.ACCEPT_EMPTY_ARRAY_AS_NULL_OBJECT, false);
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);

        // , LocalDateTIme LocalDate , Jackson-data-JSR310
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.activateDefaultTyping(LaissezFaireSubTypeValidator.instance,
                ObjectMapper.DefaultTyping.NON_FINAL_AND_ENUMS,
                JsonTypeInfo.As.PROPERTY);
        return new GenericJackson2JsonRedisSerializer(objectMapper);
    }

    public RedisSerializer<Object> redisJdkSerializer(ResourceLoader resourceLoader) {
        return new JdkSerializationRedisSerializer(resourceLoader.getClassLoader());
    }

    public KryoCustomizer kryoCustomizer() {
        return kryo -> {
            // Register frequently used classes to improve performance
            kryo.register(Object[].class);
            kryo.register(Class.class);
            kryo.register(java.util.UUID.class, new DefaultSerializers.UUIDSerializer());
            kryo.register(ProductType.class);
            kryo.register(Map.class);
            kryo.register(Set.class);
            kryo.register(ProductProjection.class);
            kryo.register(ProductProjectionImpl.class);
            kryo.register(ProductTypeReference.class);
            kryo.register(ProductTypeReferenceImpl.class);
            kryo.register(CategoryReference.class);
            kryo.register(CategoryReferenceImpl.class);
            kryo.register(LocalizedString.class);
            kryo.register(LocalizedStringImpl.class);
            kryo.register(ProductType.class);
            kryo.register(ProductTypeImpl.class);
        };
    }

}
