package com.sephora.services.inventoryavailability.service;

import com.sephora.services.inventory.config.MockSitePagesConfiguration;
import com.sephora.services.inventoryavailability.mapping.MockAvailabilityBySitePagesMapper;
import com.sephora.services.inventoryavailability.model.availabilitysp.request.SitePageAvailabilityDto;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.SitePageAvailabilityResponse;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang.math.DoubleRange;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Log4j2
@Service
public class MockAvailabilityBySitePagesService {

    private double defaultAvailabilityHubDelay = 1.5;
    @Value("#{'${availabilitybysitepages.mock.distribution}'.split(',')}")
    private List<String> distributions;

    @Autowired
    private MockAvailabilityBySitePagesMapper mockAvailabilityBySitePagesMapper;

    @Autowired
    private MockSitePagesConfiguration configuration;


    private Map<DoubleRange, double[]> distributionMap = new TreeMap<DoubleRange, double[]>(
            new Comparator<DoubleRange>() {
                @Override
                public int compare(DoubleRange o1, DoubleRange o2) {
                    return Double.compare(o2.getMaximumDouble() - o2.getMaximumDouble(),
                            o1.getMaximumDouble() - o1.getMinimumDouble());
                }
            });


    /**
     * Emulate availability hub delay
     */
    public void emulateReservationDelay() {
        try {
            long delay = getNextAvailabilityHubDelay();
            log.info("Emulating availability hub delay... delay is {} ms", delay);
            TimeUnit.MILLISECONDS.sleep(delay);
        } catch (InterruptedException e) {
            log.warn("Emulating availability hub delay: awakened prematurely");
        }
    }

    /**
     * generates delay in milliseconds for availability hub call
     *
     * @return
     */
    private long getNextAvailabilityHubDelay() {
        Random r = new Random();
        Double delay = null;
        double value = r.nextDouble() * 100;
        // select range
        for (Map.Entry<DoubleRange, double[]> entry : distributionMap.entrySet()) {
            if (entry.getKey().containsDouble(value)) {
                // get random delay in the selected range
                delay = getRandomInRange(entry.getValue()[0], entry.getValue()[1]);
            }
        }
        if (delay == null) {
            delay = getDefaultAvailabilityHubDelay();
        }
        long delayMs = Math.round(delay);
        log.debug("Return availability hub delay: {} milliseconds.", delayMs);
        return delayMs;
    }

    private static double getRandomInRange(double min, double max) {
        Random r = new Random();
        return min + (max - min) * r.nextDouble();
    }

    /**
     * build distribution map
     */
    @PostConstruct
    public void init() {
        log.debug(distributions);
        double minPercValue = 0;
        double maxPercValue = 0;
        for (String distribution : distributions) {
            String[] entry = distribution.split(":");
            String[] delayRage = entry[0].split("-");
            double requestPerc = Double.parseDouble(entry[1].substring(0, entry[1].indexOf("%")).trim());
            maxPercValue += requestPerc;

            this.distributionMap.put(new DoubleRange(minPercValue, maxPercValue),
                    new double[] {Double.parseDouble(delayRage[0]), Double.parseDouble(delayRage[1])});

            minPercValue = maxPercValue;
        }
    }

    public double getDefaultAvailabilityHubDelay() {
        return defaultAvailabilityHubDelay;
    }

    public void setDefaultAvailabilityHubDelay(double defaultAvailabilityHubDelay) {
        this.defaultAvailabilityHubDelay = defaultAvailabilityHubDelay;
    }

    public SitePageAvailabilityResponse getMockResponse(SitePageAvailabilityDto sitePageAvailability, Boolean isDetails) {
        log.info("getting mock response for request {}", sitePageAvailability);
        emulateReservationDelay();
        return mockAvailabilityBySitePagesMapper.convert(sitePageAvailability, isDetails, configuration);
    }
}
