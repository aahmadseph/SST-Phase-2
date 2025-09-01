package com.sephora.productexpservice.configuration.exception;

public class ReferenceItemNotFoundException extends Exception {

   public ReferenceItemNotFoundException(Throwable cause) {
      super(cause);
   }

   public ReferenceItemNotFoundException(String message) {
      super(message);
   }
}

