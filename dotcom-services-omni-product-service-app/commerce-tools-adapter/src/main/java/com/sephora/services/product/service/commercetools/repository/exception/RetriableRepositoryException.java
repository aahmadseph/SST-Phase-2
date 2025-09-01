package com.sephora.services.product.service.commercetools.repository.exception;

import java.io.Serial;

public class RetriableRepositoryException extends RepositoryException {

    @Serial
    private static final long serialVersionUID = -5202001584918094266L;

    public RetriableRepositoryException(String message, Throwable cause) {
        super(message, cause);
    }
}
