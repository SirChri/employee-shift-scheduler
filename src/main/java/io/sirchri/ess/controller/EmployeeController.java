package io.sirchri.ess.controller;

import io.sirchri.ess.model.Employee;
import io.sirchri.ess.repository.EmployeeRepository;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController extends GenericController<Employee> {
    private static final Logger logger = LoggerFactory.getLogger(EmployeeController.class);
    
    public EmployeeController(EmployeeRepository repo) {
        super(repo);
    }

}