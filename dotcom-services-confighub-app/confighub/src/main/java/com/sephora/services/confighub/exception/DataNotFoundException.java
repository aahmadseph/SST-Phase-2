package com.sephora.services.confighub.exception;

import lombok.Getter;

@Getter
public class DataNotFoundException extends RuntimeException {

  public DataNotFoundException(Throwable cause) {
    super(cause);
  }

  public DataNotFoundException(String message) {
    super(message);
  }
}
