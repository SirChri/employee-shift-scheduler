package io.sirchri.ess.integration;

import io.sirchri.ess.model.Customer;
import io.sirchri.ess.model.Employee;
import io.sirchri.ess.model.Event;
import io.sirchri.ess.repository.CustomerRepository;
import io.sirchri.ess.repository.EmployeeRepository;
import io.sirchri.ess.repository.EventRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@Transactional
class EventRepositoryIT extends BaseIT {
    
    private Customer customer1;
    private Employee employee1;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private CustomerRepository customerRepo;
    
    @Autowired
    private EmployeeRepository employeeRepo;
    
    void beforeAll() {
        eventRepository.deleteAll();
        
        Customer c = new Customer();
        c.setName("Cliente 1");
        c.setVat("123");
        
        customer1 = customerRepo.save(c);
        
        Employee em = new Employee();
        em.setName("name");
        em.setSurname("surname");
        em.setNumber("1");
        em.setColor("#FFF");
        em.setActive(Boolean.TRUE);
        
        employee1 = employeeRepo.save(em);
    }
    
    @Test
    void recurringEventShouldExpandCorrectlyInRange() {
        beforeAll();
        
        Event e = new Event();
        e.setTitle("Corso di tennis");
        e.setTypeFk("JOB");
        e.setSummary("Lezione ricorrente");
        e.setDtStamp(ZonedDateTime.now(ZoneId.of("UTC")));
        e.setDtStart(ZonedDateTime.of(2025, 1, 6, 10, 0, 0, 0, ZoneId.of("Europe/Rome"))); // Lun 6 Gen
        e.setDtEnd(e.getDtStart().plusHours(2));
        e.setDtEndTzFk("Europe/Rome");
        e.setDtStartTzFk("Europe/Rome");
        e.setRecurring(true);
        e.setFrequency(2);
        e.setInterval(1);
        e.setUntilType(2);
        e.setCustomer(customer1);
        e.setEmployee(employee1);
        e.setUntilOccurrences(3);
        e.setSequence(0);
        
        eventRepository.save(e);

        ZonedDateTime start = ZonedDateTime.of(2025, 1, 1, 0, 0, 0, 0, ZoneId.of("UTC"));
        ZonedDateTime end   = ZonedDateTime.of(2025, 2, 1, 0, 0, 0, 0, ZoneId.of("UTC"));

        List<Map> results = eventRepository.eventsInRange(
                start,
                end,
                null,   // nessun gruppo filtrato
                true,        // dettagli = espandi ricorrenze
                "Europe/Rome"
        );

        assertThat(results).isNotEmpty();
        assertThat(results).hasSize(3); 

        List<String> dtStarts = results.stream()
                .map(r -> (String) r.get("dtstart"))
                .sorted()
                .toList();

        assertThat(dtStarts).containsExactly(
            "2025-01-06T10:00:00+01:00",
            "2025-01-13T10:00:00+01:00",
            "2025-01-20T10:00:00+01:00"
        );
        
    }
    
    @Test
    void recurringEventShouldHandleDstCorrectly() {
        beforeAll();

        // Evento settimanale alle 10:00 CET, ricorrente 10 settimane
        Event e = new Event();
        e.setTitle("Corso di tennis");
        e.setTypeFk("JOB");
        e.setSummary("Lezione ricorrente DST");
        e.setDtStamp(ZonedDateTime.now(ZoneId.of("UTC")));
        e.setDtStart(ZonedDateTime.of(2025, 3, 16, 10, 0, 0, 0, ZoneId.of("Europe/Rome"))); // prima del cambio ora legale
        e.setDtEnd(e.getDtStart().plusHours(2));
        e.setDtStartTzFk("Europe/Rome");
        e.setDtEndTzFk("Europe/Rome");
        e.setRecurring(true);
        e.setFrequency(2);
        e.setInterval(1);
        e.setUntilType(2);
        e.setUntilOccurrences(4);
        e.setCustomer(customer1);
        e.setEmployee(employee1);

        eventRepository.save(e);

        ZonedDateTime start = ZonedDateTime.of(2025, 3, 1, 0, 0, 0, 0, ZoneId.of("Europe/Rome"));
        ZonedDateTime end   = ZonedDateTime.of(2025, 4, 30, 23, 59, 59, 0, ZoneId.of("Europe/Rome"));

        List<Map> results = eventRepository.eventsInRange(
                start,
                end,
                null,
                true,
                "Europe/Rome"
        );

        assertThat(results).hasSize(4);

        List<String> dtStarts = results.stream()
                .map(r -> (String) r.get("dtstart"))
                .sorted()
                .toList();

        assertThat(dtStarts).containsExactly(
                "2025-03-16T10:00:00+01:00", // CET
                "2025-03-23T10:00:00+01:00", // CET
                "2025-03-30T10:00:00+02:00", // CEST (ora legale)
                "2025-04-06T10:00:00+02:00"  // CEST
        );
    }

    @Test
    void recurringEventWithExDatesShouldSkipExcludedDates() {
        beforeAll();

        // Evento settimanale 3 occorrenze
        Event e = new Event();
        e.setTitle("Yoga Class");
        e.setTypeFk("JOB");
        e.setSummary("Lezione ricorrente con esclusioni");
        e.setDtStamp(ZonedDateTime.now(ZoneId.of("UTC")));
        e.setDtStart(ZonedDateTime.of(2025, 1, 6, 10, 0, 0, 0, ZoneId.of("Europe/Rome"))); // Lun 6 Gen
        e.setDtEnd(e.getDtStart().plusHours(2));
        e.setDtStartTzFk("Europe/Rome");
        e.setDtEndTzFk("Europe/Rome");
        e.setRecurring(true);
        e.setFrequency(2); // settimanale
        e.setInterval(1);
        e.setUntilType(2);
        e.setUntilOccurrences(3);
        e.setExDates("2025-01-13T10:00:00+01:00"); // escludo la seconda ricorrenza
        e.setCustomer(customer1);
        e.setEmployee(employee1);

        eventRepository.save(e);

        ZonedDateTime start = ZonedDateTime.of(2025, 1, 1, 0, 0, 0, 0, ZoneId.of("Europe/Rome"));
        ZonedDateTime end   = ZonedDateTime.of(2025, 1, 31, 23, 59, 59, 0, ZoneId.of("Europe/Rome"));

        List<Map> results = eventRepository.eventsInRange(start, end, null, true, "Europe/Rome");

        // La ricorrenza del 13 Gen deve essere saltata
        assertThat(results).hasSize(2);

        List<String> dtStarts = results.stream()
                .map(r -> (String) r.get("dtstart"))
                .sorted()
                .toList();

        assertThat(dtStarts).containsExactly(
                "2025-01-06T10:00:00+01:00",
                "2025-01-20T10:00:00+01:00"
        );
    }
}
