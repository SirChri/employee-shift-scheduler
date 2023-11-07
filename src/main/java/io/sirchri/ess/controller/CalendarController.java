package io.sirchri.ess.controller;

import io.sirchri.ess.model.Calendar;
import io.sirchri.ess.repository.CalendarRepository;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController extends GenericController<Calendar> {
    private static final Logger logger = LoggerFactory.getLogger(CalendarController.class);
    
    public CalendarController(CalendarRepository repo) {
        super(repo);
    }

}