package io.sirchri.ess.repository;

import io.sirchri.ess.model.Event;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends  GenericRepository<Event> {}