package com.sephora.services.confighub.utils;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.sephora.confighubclient.enums.ConfigHubChannelEnum;
import com.sephora.services.confighub.dto.ChannelValuesDto;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;

@Slf4j
public class ConfigurationUtils {

    /**
     *
     * @param channelValues
     * @return
     */
    public static ChannelValuesDto convertJsonToChannelValuesDTO(String channelValues) {
        Gson gson = new Gson();
        ChannelValuesDto valuesDto = gson.fromJson(channelValues, ChannelValuesDto.class);
        return valuesDto;
    }

    /**
     * Removes prefix from the given string
     *
     * @param attribute The attribute to modify
     * @param prefix    The prefix to remove
     * @return
     */
    public static String removePrefix(String attribute, String prefix) {
        return attribute.replaceFirst("" + prefix, "");
    }

    /**
     * Identify if configuration.val is string or json
     *
     * @param jsonString
     * @return
     */
    public static boolean determineJsonType(String jsonString) {
        boolean	isJson = false;
        try {
            JsonElement jsonElement = JsonParser.parseString(jsonString);
            isJson = jsonElement.isJsonObject();

        } catch (Exception e){
            log.info("Unable to parse string. The associated configuration will share value as propkey.");
        }
        return isJson;
    }

    public static boolean isValid(String input){
        return Constants.BASE.equalsIgnoreCase(input) ||
                Arrays.stream(ConfigHubChannelEnum.values()).anyMatch(configChannelEnum ->
                input.equalsIgnoreCase(configChannelEnum.getValue()));
    }
    
    public static String toJson(ChannelValuesDto channelValuesDto) {
    	if(null == channelValuesDto) {
    		return null;
    	}
    	Gson gson = new Gson();
    	return gson.toJson(channelValuesDto);
    }
}
