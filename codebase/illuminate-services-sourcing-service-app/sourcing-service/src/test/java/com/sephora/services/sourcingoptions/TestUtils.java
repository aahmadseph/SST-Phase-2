package com.sephora.services.sourcingoptions;

import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microsoft.azure.documentdb.bulkexecutor.BulkImportResponse;
import com.sephora.services.sourcingoptions.model.cosmos.ShipNode;


import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.IntStream;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

/**
 * @author Vitaliy Oleksiyenko
 */
public class TestUtils {

    private static final String CHAR_LIST =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

    public static String generateRandomString(int length) {
        return IntStream.range(0, length)
                .map(i -> ThreadLocalRandom.current().nextInt(CHAR_LIST.length() - 1))
                .map(CHAR_LIST::charAt)
                .collect(StringBuilder::new, StringBuilder::append, StringBuilder::append)
                .toString();
    }

    public static void clearAllCaches(CacheManager cacheManager){
        cacheManager.getCacheNames().stream()
            .forEach(cacheName -> {
                Cache cache = cacheManager.getCache(cacheName);
                assertThat(cache).isNotNull();
                cache.clear();
            });
    }
    
	public static List<ShipNode> getShipNodeFromConstants() {
		return Arrays.asList(ShipNode.builder().id("0701").build(), ShipNode.builder().id("1001").build(),
				ShipNode.builder().id("0801").build(), ShipNode.builder().id("1021").build());
	}
	
	public enum JSON_INPUT_TYPE {
		INPUT, RESPONSE
	}
	
	/**
	 * Read json data from give fine and directory and convert the same to specific object
	 * @param <T>
	 * @param fileName
	 * @param inputType
	 * @param valueType
	 * @return
	 */
	public static <T> T readObjectFromJsonFile(String fileName, JSON_INPUT_TYPE inputType, Class<T> valueType) {
		File file = new File(SourcingoptionsTestConstants.RESOURCE_PATH + inputType.toString().toLowerCase() + File.separator + fileName);
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		try {
			return mapper.readValue(file, valueType);
		} catch (IOException e) {
			return null;
		}
	}
	
	public static String readJsonFromFile(String fileName, JSON_INPUT_TYPE inputType) {
		File file = new File(SourcingoptionsTestConstants.RESOURCE_PATH + inputType.toString().toLowerCase()
				+ File.separator + fileName);
		BufferedReader br = null;
		try {
			br = new BufferedReader(new InputStreamReader(new FileInputStream(file)));
			String jsonStr = "";
			String readLine = null;
			while ((readLine = br.readLine()) != null) {
				jsonStr += readLine;
			}
			return jsonStr;
		} catch (IOException e) {
			return null;
		} finally {
			if (null != br) {
				try {
					br.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
}
