package com.sephora.services.product.service.commercetools.cache.serializer;

import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryo.io.Input;
import com.esotericsoftware.kryo.io.Output;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.SerializationException;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.zip.DeflaterOutputStream;
import java.util.zip.InflaterInputStream;

@Slf4j
public class KryoRedisSerializer<T> implements RedisSerializer<T> {

    private KryoCustomizer kryoCustomizer;
    private boolean enableCompression = true;

    public KryoRedisSerializer(KryoCustomizer kryoCustomizer, boolean enableCompression) {
        this.enableCompression = enableCompression;
        this.kryoCustomizer = kryoCustomizer;
    }

    // Use ThreadLocal to hold Kryo instances per thread
    private final ThreadLocal<Kryo> kryoThreadLocal = ThreadLocal.withInitial(() -> {
        Kryo kryo = new Kryo();
        kryo.setRegistrationRequired(false);
        if (kryoCustomizer != null) {
            kryoCustomizer.customize(kryo);
        }
        return kryo;
    });

    @Override
    public byte[] serialize(T value) throws SerializationException {
        if (value == null) {
            return new byte[0];
        }
        if (enableCompression) {
            return serializeWithCompression(value);
        } else {
            return serializeWithoutCompression(value);
        }
    }

    private byte[] serializeWithCompression(T value) throws SerializationException {
        var kryo = kryoThreadLocal.get();
        try {
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            DeflaterOutputStream deflaterOutputStream = new DeflaterOutputStream(byteArrayOutputStream);
            Output output = new Output(deflaterOutputStream);
            kryo.writeObject(output, value);
            output.close();
            return byteArrayOutputStream.toByteArray();
        } catch (Exception e) {
            log.error("Error during serialization with compression", e);
            throw new SerializationException("Error during serialization with compression", e);
        }
    }

    private byte[] serializeWithoutCompression(T value) throws SerializationException {
        var kryo = kryoThreadLocal.get();
        try {
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            Output output = new Output(byteArrayOutputStream);
            kryo.writeObject(output, value);
            output.close();
            return byteArrayOutputStream.toByteArray();
        } catch (Exception e) {
            log.error("Error during serialization without compression", e);
            throw new SerializationException("Error during serialization without compression", e);
        }
    }

    @Override
    public T deserialize(byte[] bytes) throws SerializationException {
        if (bytes == null || bytes.length == 0) {
            return null;
        }
        if (enableCompression) {
            return deserializeWithCompression(bytes);
        } else {
            return deserializeWithoutCompression(bytes);
        }
    }

    private T deserializeWithoutCompression(byte[] bytes) throws SerializationException {
        Kryo kryo = kryoThreadLocal.get();
        try {
            ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);
            Input input = new Input(byteArrayInputStream);
            @SuppressWarnings("unchecked")
            T obj = (T) kryo.readClassAndObject(input);
            return obj;
        } catch (Exception e) {
            throw new SerializationException("Could not deserialize object without compression", e);
        }
    }

    private T deserializeWithCompression(byte[] bytes) throws SerializationException {
        Kryo kryo = kryoThreadLocal.get();
        try {
            ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);
            InflaterInputStream inflaterInputStream = new InflaterInputStream(byteArrayInputStream);
            Input input = new Input(inflaterInputStream);
            @SuppressWarnings("unchecked")
            T obj = (T) kryo.readObject(input, Object.class);
            return obj;
        } catch (Exception e) {
            throw new SerializationException("Could not deserialize object without compression", e);
        }
    }
}
