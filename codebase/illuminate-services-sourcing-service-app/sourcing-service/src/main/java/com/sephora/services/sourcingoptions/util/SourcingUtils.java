package com.sephora.services.sourcingoptions.util;

import com.sephora.services.sourcingoptions.SourcingOptionConstants;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;

import com.sephora.services.sourcingoptions.model.FulfillmentTypeEnum;
import lombok.extern.log4j.Log4j2;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;

@Log4j2
public class SourcingUtils {

    private final static String AVS_ZIP_CODE_SEPARATOR = "-";
    private final static int US_ZIP_CODE_LENGTH = 5;
    private final static int CA_ZIP_CODE_LENGTH = 3;
    private final String ISO_DATEFORMAT_WITH_SECONDS = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX";
    private final static String AVAILABILITY_HUB_UTC_FORMAT = "yyyy-MM-dd'T'HH:mm:ss'Z'";
    private final static String OMS_PST_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX";

    /**
     * Normalize zip code for retrieving zone maps:
     * - for US: return first 5 characters (or till the hyphen for AVS zip code)
     * - for CA: return first 3 characters
     */
    public static String getNormalizedZipCode(String zipCode, EnterpriseCodeEnum enterpriseCode) {
        if (StringUtils.isNotBlank(zipCode) && enterpriseCode != null) {
            zipCode = zipCode.trim().toUpperCase();
            if (enterpriseCode == EnterpriseCodeEnum.SEPHORAUS) {
                // For US: truncate to 5 first symbols (or till the hyphen for AVS zip code, e.g. "78947-5283")
                int zipCodeLength = zipCode.contains(AVS_ZIP_CODE_SEPARATOR) ? zipCode.indexOf(AVS_ZIP_CODE_SEPARATOR) :
                        US_ZIP_CODE_LENGTH;
                if (zipCode.length() > zipCodeLength) {
                    zipCode = zipCode.substring(0, zipCodeLength);
                }
                return zipCode;
            } else {
                // For CA: remove all whitespaces and truncate to 3 first characters
                return StringUtils.deleteWhitespace(zipCode).substring(0, CA_ZIP_CODE_LENGTH);
            }
        }
        return zipCode;
    }

    /**
     * Normalize zip code for retrieving zone maps:
     * - for US: return first 5 characters (or till the hyphen for AVS zip code)
     * - for CA: return all characters after removing whitespace.
     */
    public static String getNormalizedZipCodeForSourcingHub(String zipCode, EnterpriseCodeEnum enterpriseCode) {
        if (StringUtils.isNotBlank(zipCode) && enterpriseCode != null) {
            zipCode = zipCode.trim().toUpperCase();
            if (enterpriseCode == EnterpriseCodeEnum.SEPHORAUS) {
                // For US: truncate to 5 first symbols (or till the hyphen for AVS zip code, e.g. "78947-5283")
                int zipCodeLength = zipCode.contains(AVS_ZIP_CODE_SEPARATOR) ? zipCode.indexOf(AVS_ZIP_CODE_SEPARATOR) :
                        US_ZIP_CODE_LENGTH;
                if (zipCode.length() > zipCodeLength) {
                    zipCode = zipCode.substring(0, zipCodeLength);
                }
                return zipCode;
            } else {
                // For CA: remove all whitespaces
                // no need to truncate, so created a new function.
                return StringUtils.deleteWhitespace(zipCode);
            }
        }
        return zipCode;
    }
    
    public static String currentPSTDateTime() throws Exception {
		DateFormat dateFormate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
		dateFormate.setTimeZone(TimeZone.getTimeZone("PST"));
		return dateFormate.format(new Date());
	}

	public static String addDaysToCurrentTime(Integer days) throws Exception{
        Calendar c = Calendar.getInstance();
        c.setTime(new Date()); // Now use today date.
        c.add(Calendar.DATE, days);
        DateFormat dateFormate = new SimpleDateFormat(AVAILABILITY_HUB_UTC_FORMAT);
        return dateFormate.format(c.getTime());
    }

	public static String convertToPstFromUTC(String utcDateTime) throws Exception {
        DateFormat dateFormate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
        dateFormate.setTimeZone(TimeZone.getTimeZone("UTC"));
        Date utcDate = dateFormate.parse(utcDateTime);
        DateFormat pstDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        pstDateFormat.setTimeZone(TimeZone.getTimeZone("PST"));
        return pstDateFormat.format(utcDate);
    }

    public static String convertToTimeZoneFromUTC(String utcDateTime, String timezone) throws Exception{
        DateFormat dateFormate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
        dateFormate.setTimeZone(TimeZone.getTimeZone("UTC"));
        Date utcDate = dateFormate.parse(utcDateTime);
        DateFormat pstDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        pstDateFormat.setTimeZone(TimeZone.getTimeZone(ZoneId.of(timezone)));
        return pstDateFormat.format(utcDate);
    }

    public static String getZoneOffset(String timeZone){
        TimeZone tz = TimeZone.getTimeZone(ZoneId.of(timeZone));
        Calendar calendar = Calendar.getInstance(tz);
        SimpleDateFormat formatter = new SimpleDateFormat("Z");
        formatter.setTimeZone(tz);
        String timeZoneStr = formatter.format(calendar.getTime());
        //String formattedStr = String.valueOf(-(calendar.get(Calendar.ZONE_OFFSET) + calendar.get(Calendar.DST_OFFSET)) / (60 * 1000));
        return timeZoneStr.substring(0, 3) + ":"+ timeZoneStr.substring(3, 5);
    }
    
    public static String currentDateTime(String timezone) {
		DateFormat dateFormate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
		dateFormate.setTimeZone(TimeZone.getTimeZone(ZoneId.of(timezone)));
		return dateFormate.format(new Date());
	}

	public static String currentDateTime(String timezone, Integer hours){
        DateFormat dateFormate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        dateFormate.setTimeZone(TimeZone.getTimeZone(ZoneId.of(timezone)));
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone(ZoneId.of(timezone)));
        calendar.set(Calendar.HOUR, hours);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return dateFormate.format(calendar.getTime());
    }

    public static String convertToYantriksFulfillmentType(String fulfillmentType){
        if(fulfillmentType == null){
            return null;
        }
        if(fulfillmentType.equals(FulfillmentTypeEnum.SHIPTOHOME.toString())){
            return SourcingOptionConstants.SHIPTOHOME_YANTRIKS;
        }else{
            return fulfillmentType;
        }
    }

    public static <T> T convertInstanceOfObject(Object o, Class<T> clazz) {
        try {
            return clazz.cast(o);
        } catch(ClassCastException e) {
            return null;
        }
    }
    
    public static String getCacheBackupObject(String basePath, String cacheName,String cacheKey) {
    	FileInputStream is = null;
		try {
			is = new FileInputStream(basePath + File.separator + cacheName + File.separator + cacheKey );
			BufferedReader reader = new BufferedReader(new InputStreamReader(is));
			return (String) reader.lines().collect(Collectors.joining(System.lineSeparator()));
		} catch (Exception e) {
			log.error("An exception occurred while read from storage: {}", e.getMessage(), e);
			return null;
		} finally {
			if(null != is)
				try {
					is.close();
				} catch (IOException e) {
					return null;
				}
		}
    }
  }
