//package com.sephora.services.inventoryavailability.service;
//
////import com.sephora.services.customernotificationservice.feign.EsbEmailClient;
////import com.sephora.services.customernotificationservice.model.email.EmailEsbRequestDto;
////import com.sephora.services.customernotificationservice.service.EmailService;
////import com.sephora.services.customernotificationservice.validator.SepValidationException;
////import com.sephora.services.customernotificationservice.validator.Validator;
//import lombok.extern.log4j.Log4j2;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//@Log4j2
//@Service
//public class EmailServiceImpl implements EmailService {
//    @Autowired
//    private EsbEmailClient esbEmailClient;
//    @Autowired
//    private Validator validator;
//
//    public void send(EmailEsbRequestDto emailEsbRequestDto) throws SepValidationException {
//        log.debug("validating email request received {}", emailEsbRequestDto);
//        validator.validateItem(emailEsbRequestDto);
//        log.debug("successfully validated email request. Submitting request");
//        esbEmailClient.submitEmail(emailEsbRequestDto);
//        log.debug("successfully submitted email request to esb");
//    }
//}
