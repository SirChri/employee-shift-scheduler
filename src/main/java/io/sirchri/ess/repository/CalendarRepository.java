package io.sirchri.ess.repository;

import io.sirchri.ess.model.Calendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CalendarRepository extends GenericRepository<Calendar> {}