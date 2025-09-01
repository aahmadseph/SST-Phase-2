package com.sephora.services.product.service.commercetools.cache.serializer;

import com.esotericsoftware.kryo.Kryo;

@FunctionalInterface
public interface KryoCustomizer {

    /**
     * Customize the Kryo instance.
     *
     * @param kryo the Kryo instance to customize
     */
    void customize(Kryo kryo);
}
