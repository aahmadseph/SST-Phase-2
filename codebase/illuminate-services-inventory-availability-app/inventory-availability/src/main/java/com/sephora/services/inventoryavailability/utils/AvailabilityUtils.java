package com.sephora.services.inventoryavailability.utils;


import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sephora.services.common.dynamicconfig.DynamicConfigConstants;
import com.sephora.services.inventory.model.cache.ShipNodeCache;

import lombok.extern.log4j.Log4j2;
@Log4j2
public class AvailabilityUtils {

	/**
	 * To create redis cache key with given product id and selling channel
	 * 
	 * @param productId
	 * @param sellingChannel
	 * @return
	 */
	public static String createNetworkThresholdRedisCacheKey(String productId, String sellingChannel) {
		return productId + "_" + sellingChannel;
	}

	public static String createLocationAvailabilityRedisCacheKey(String cacheName, String productId, String locationId) {
		return cacheName + "_" + productId + "_" + locationId;
	}

	public static String createIntransitAvailabilityRedisCacheKey(String cacheName, String productId, String locationId) {
		return cacheName + "_" + locationId + "_" + productId;
	}
	
	public static String createLocationAvailabilityRedisCacheKey(String productId, String locationId) {
		return productId + "_" + locationId;
	}
	
	public static String currentPSTDateTime() {
		DateFormat dateFormate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
		dateFormate.setTimeZone(TimeZone.getTimeZone("PST"));
		return dateFormate.format(new Date());
	}

	public static File storageLocationPath(String folderBaseLocation,String shipNodeKey){
		String fileFullPath = folderBaseLocation + File.separator + DynamicConfigConstants.SHIP_NODE + File.separator + shipNodeKey;
		File file = new File(fileFullPath);
		return file;
	}
	
	public static  String getFileDataAsString(File file) {
//        FileInputStream is = null;
        try(FileInputStream is = new FileInputStream(file); BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
            return (String) reader.lines().collect(Collectors.joining(System.lineSeparator()));
        } catch (Exception e) {
        	log.error("An exception occurred while getting File Data As String cache: {}", e.getMessage(), e);
            return null;
        }
    }
	
	public static void writeShipNodeDataToFile(ObjectMapper mapper, ShipNodeCache shipNodeCache, File shipNodeFile) {
    	FileWriter fileWriter = null; 
    	try {
	        String jsonFileData = mapper.writeValueAsString(shipNodeCache);
	        fileWriter = new FileWriter(shipNodeFile,false);
	        fileWriter.write(jsonFileData);
	        fileWriter.close();    	
		} catch (IOException e) {
			log.error("An error occured while writing file: {}",shipNodeFile, e);
		} finally {
			if(null != fileWriter)
				try {
					fileWriter.close();
				} catch (IOException e) {
					log.error("An error occured while writing file: {}",shipNodeFile, e);
				}
		}
    }
}
