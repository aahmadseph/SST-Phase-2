package com.sephora.services.confighub.utils;

import java.util.Arrays;
import java.util.List;

import lombok.experimental.UtilityClass;

@UtilityClass
public class Constants {

    public static final String CONFIGHUB_PREFIX = "confighub.";
    public static final String BASE = "base";
    public static final String WEB = "web";
    public static final String ANDROID_APP = "androidapp";
    public static final String IPHONE_APP = "iphoneapp";
    public static final String RWD = "rwd";
    public static final String MOBILE_WEB = "mobileweb";
    public static final String CONFIGURATION_EXISTS = "configuration.exists";
    public static final String PROP = "prop";
    public static final String DESC = "desc";
    public static final String SORT_MODE_ALL = "all";
    public static final String UICONSUME = "1";
    public static final String RECENT = "recent";
    public static final String MODIFIED_DATE = "modifiedDate";
	public static final String UPDATE_PROP_KEY_EXISTS = "update.propkey.exists";
	
	public static final List<String> CH_LIST = Arrays.asList(BASE, WEB, ANDROID_APP, IPHONE_APP, RWD, MOBILE_WEB);
    
}
