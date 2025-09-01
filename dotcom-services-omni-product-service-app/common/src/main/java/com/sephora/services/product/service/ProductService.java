package com.sephora.services.product.service;

import com.sephora.services.product.model.Product;

import java.util.Collection;
import java.util.Locale;
import java.util.Set;

public interface ProductService {
    /**
     * Retrieves a list of products by their IDs.
     *
     * @param productIds IDs of products to retrieve
     * @return the product list with specified IDs, or null if not found
     */
    Set<Product> getProductsByIds(Collection<String> productIds, Locale locale);

    Product getProductById(String productId, Locale locale);
}
