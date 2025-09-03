package com.sephora.services.product.service.commercetools.repository.exception;

import java.io.Serial;

public class ConcurrentModificationRepositoryException extends RepositoryException {

    @Serial
    private static final long serialVersionUID = -5739241866330330647L;

    public ConcurrentModificationRepositoryException(String message) {
        super(message);
    }
}
