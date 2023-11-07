package io.sirchri.ess.controller;

import io.sirchri.ess.model.Event;
import io.sirchri.ess.repository.EventRepository;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/event")
public class EventController extends GenericController<Event> {
    private static final Logger logger = LoggerFactory.getLogger(EventController.class);
    
    public EventController(EventRepository repo) {
        super(repo);
    }

}