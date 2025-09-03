package com.sephora.services.sourcingoptions.validation;

import java.util.regex.Pattern;

/**
 * @author Vitaliy Oleksiyenko
 */
public class ValidationConstants {

    public static final int ITEM_ID_MAX_LENGTH = 40;
    public static final int ENTERPRISE_CODE_MAX_LENGTH = 40;
    public static final int SHIP_NODE_KEY_MAX_LENGTH = 40;
    public static final int THRESHOLD_MAX_LENGTH = 24;
    public static final int FROM_ZIP_CODE_MAX_LENGTH = 5;
    public static final int TO_ZIP_CODE_MAX_LENGTH = 5;
    public static final int NODE_PRIORITY_ZIP_CODE_MAX_LENGTH = 40;
    public static final int REFERENCE_MAX_LENGTH = 100;
    public static final int DELAY_TIME_MAX_DIGITS = 2;
    
    public static final String DELAY_DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";

    public static final String ENTERPRISE_CODE_ALLOWED_VALUES = "SEPHORAUS, SEPHORACA";
    public static final String FULFILLMENT_TYPE__ALLOWED_VALUES = "SHIPTOHOME, ELECTRONIC";
    public static final String LOCK_STATUS_ALLOWED_VALUES = "ACTIVE, LOCKED";
    public static final String COUNTRY_ALLOWED_VALUES = "US, CA";
    public static final String NODE_PRIORITY_DELIMITER = "|";
    public static final Pattern NODE_PRIORITY_PIPE_PATTERN = Pattern.compile("\\|");
    public static final String LEVEL_OF_SERVICES_ALLOWED_VALUES = "STANDARD, EXPRESS, FLASH";
}
