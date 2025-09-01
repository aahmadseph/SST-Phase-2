package com.sephora.services.confighub.exception;


public class ConfigurationServiceException extends Exception {

   /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

public ConfigurationServiceException(Throwable cause) {
      super(cause);
   }

   public ConfigurationServiceException(String message) {
      super(message);
   }
   
   public ConfigurationServiceException(String message, Throwable cause) {
       super(message, cause);
   }
}
