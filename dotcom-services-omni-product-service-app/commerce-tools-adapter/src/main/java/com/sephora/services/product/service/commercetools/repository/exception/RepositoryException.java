package com.sephora.services.product.service.commercetools.repository.exception;

import java.io.Serial;

public class RepositoryException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 6543027747274223584L;

    public RepositoryException(String message) {
        super(message);
    }

    public RepositoryException(Throwable cause) {
        super(cause);
    }

    public RepositoryException(String message, Throwable cause) {
        super(message, cause);
    }
}
