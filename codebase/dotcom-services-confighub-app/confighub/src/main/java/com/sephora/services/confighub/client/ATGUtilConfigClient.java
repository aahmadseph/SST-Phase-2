package com.sephora.services.confighub.client;

import feign.HeaderMap;
import feign.RequestLine;
import java.util.Map;

public interface ATGUtilConfigClient {

  @RequestLine("GET")
  Map<String, Object> getUtils(@HeaderMap Map<String, Object> headers);
}
