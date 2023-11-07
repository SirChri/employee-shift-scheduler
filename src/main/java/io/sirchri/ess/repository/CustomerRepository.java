package io.sirchri.ess.repository;

import io.sirchri.ess.model.Customer;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends GenericRepository<Customer> {
}