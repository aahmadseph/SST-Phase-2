package com.sephora.services.confighub.service.impl;

import com.sephora.services.confighub.client.ATGUtilConfigClient;
import com.sephora.services.confighub.config.ATGUtilClientConfig;
import com.sephora.services.confighub.service.ATGConfigUtilService;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Hex;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

/** Service class to retrieve ATG Configs */
@Service
@Slf4j
public class ATGConfigUtilServiceImpl implements ATGConfigUtilService {

  private ATGUtilClientConfig atgClientConfig;

  private ATGUtilConfigClient atgUtilConfigClient;

  public static final String X_REQUESTED_SOURCE = "x-requested-source";
  public static final String COOKIE = "Cookie";
  public static final String GMT = "GMT";
  public static final String HDTS_HEADER = "HDTS";
  public static final String SAAT_HEADER = "SAAT";
  public static final String TS_HEADER = "TS";

  public ATGConfigUtilServiceImpl(
      ATGUtilClientConfig atgClientConfig, ATGUtilConfigClient atgUtilConfigClient) {
    this.atgClientConfig = atgClientConfig;
    this.atgUtilConfigClient = atgUtilConfigClient;
  }

  /** Returns atg response or an empty map */
  @Cacheable(value = "atgConfigs", key = "#channel + #siteLocale + #siteLanguage", unless = "#result==null or #result.isEmpty()")
  public Map<String, Object> getATGUtils(String channel, String siteLocale, String siteLanguage) {
    Map<String, Object> response = new HashMap<>();
    try {
      response = atgUtilConfigClient.getUtils(getHeaders(siteLocale, siteLanguage, channel));
    } catch (Exception e) {
      log.error("ATG Configs not available", e);
    }
    return response;
  }

  private Map<String, Object> getHeaders(String siteLocale, String siteLanguage, String channel) {
    Map<String, Object> headers = new HashMap<>();
    Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone(GMT));
    calendar.set(Calendar.MILLISECOND, 0);
    calendar.add(Calendar.MINUTE, 15);

    Date currentDate = calendar.getTime();
    SimpleDateFormat dateFormat = new SimpleDateFormat(atgClientConfig.getApiTSFormat());
    dateFormat.setTimeZone(TimeZone.getTimeZone(GMT));

    headers.put(SAAT_HEADER, atgClientConfig.getSaat());
    headers.put(HDTS_HEADER, getHash(atgClientConfig.getDeviceId() + currentDate.getTime()));
    headers.put(TS_HEADER, dateFormat.format(currentDate));
    headers.put(X_REQUESTED_SOURCE, channel);
    headers.put(COOKIE, "site_locale=" + siteLocale + "; site_language=" + siteLanguage);
    return headers;
  }

  private String getHash(String input) {
    try {
      MessageDigest digest = MessageDigest.getInstance(atgClientConfig.getDigestAlgorithm());
      byte[] value = digest.digest(input.getBytes(StandardCharsets.UTF_8));
      return new String(Hex.encodeHex(value));
    } catch (NoSuchAlgorithmException e) {
      log.error(
          "Error while executing Digest algorithm : {}", atgClientConfig.getDigestAlgorithm());
      return null;
    }
  }
}
