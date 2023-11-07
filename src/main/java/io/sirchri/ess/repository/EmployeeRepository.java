package io.sirchri.ess.repository;

import io.sirchri.ess.model.Employee;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends GenericRepository<Employee> {
    
}