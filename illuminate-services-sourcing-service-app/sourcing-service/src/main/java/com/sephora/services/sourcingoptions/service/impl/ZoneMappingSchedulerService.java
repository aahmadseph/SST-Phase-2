package com.sephora.services.sourcingoptions.service.impl;

import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

//@Log4j2
//@Component
//@EnableScheduling
public class ZoneMappingSchedulerService {
    //@Scheduled(cron = "${zonemapping.upload.schedule:0 * * * * *}")
    public void runSchedule(){
        //log.info("running scheduled job");
    }
}
