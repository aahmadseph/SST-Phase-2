package com.sephora.services.productaggregationservice.productaggregationservice.configuration.exception;

public class ReferenceItemNotFoundException extends Exception {

   public ReferenceItemNotFoundException(Throwable cause) {
      super(cause);
   }

   public ReferenceItemNotFoundException(String message) {
      super(message);
   }
}

