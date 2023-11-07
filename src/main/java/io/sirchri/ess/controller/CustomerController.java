package io.sirchri.ess.controller;

import io.sirchri.ess.model.Customer;
import io.sirchri.ess.repository.CustomerRepository;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/customer")
public class CustomerController extends GenericController<Customer> {
    private static final Logger logger = LoggerFactory.getLogger(CustomerController.class);
    
    public CustomerController(CustomerRepository repo) {
        super(repo);
    }

}