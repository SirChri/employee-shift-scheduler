/*
 * Copyright (c) 2024 Christian Londero
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package io.sirchri.ess.repository;

import io.sirchri.ess.model.Employee;
import io.sirchri.ess.model.Event;
import static io.sirchri.ess.repository.specification.EventSpecifications.betweenDatesAndGroups;
import static io.sirchri.ess.util.DateUtils.formatZDT;
import static io.sirchri.ess.util.EntityUtils.entityToMap;
import static io.sirchri.ess.util.EventUtils.eventToVevent;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import net.fortuna.ical4j.model.Period;
import net.fortuna.ical4j.model.component.VEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Component;

/**
 * This class implements a repository for managing Event entities.
 */
@Component
public class EventRepositoryImpl {
    // Logger for logging information and debug messages
    private static final Logger logger = LoggerFactory.getLogger(EventRepositoryImpl.class);

    // Persistence context to manage entity transactions
    @PersistenceContext
    private EntityManager entityManager;

    // Executor for executing specifications on Event entities
    private JpaSpecificationExecutor<Event> executor;

    /**
     * Initializes the repository and sets up the executor.
     */
    @PostConstruct
    public void init() {
        executor = new SimpleJpaRepository<Event, String>(Event.class, entityManager);
    }

    /**
     * Retrieves a list of events in the specified date range and groups.
     * 
     * @param start The start date and time of the range.
     * @param end The end date and time of the range.
     * @param groups The list of group IDs to filter events.
     * @param detailed Flag to indicate if the events should be detailed.
     * @return A list of mapped events in the specified range.
     */
    public List<Map> eventsInRange(ZonedDateTime start, ZonedDateTime end, List<Long> groups, boolean detailed) {
        // Find all events within the date range and groups
        List<Event> events = executor.findAll(betweenDatesAndGroups(start, end, groups));
        
        // Map events to a list of records
        List<Map> records = events.stream().map(e -> this.entityMapped(e)).collect(Collectors.toList());

        // If detailed is true, expand all recurring events into child events
        if (detailed) {
            records = events.stream().filter(e -> !e.getRecurring()).map(e -> this.entityMapped(e)).collect(Collectors.toList());

            for (Event e : events.stream().filter(Event::getRecurring).collect(Collectors.toList())) {
                VEvent ev = eventToVevent(e);

                // Define the time period for recurrence calculation
                Period period = new Period(start, end);
                Set<Period<ZonedDateTime>> recurrenceSet = ev.calculateRecurrenceSet(period);
                int index = 1;

                // Loop through the recurrence set to create child events
                for (Period recurringPeriod : recurrenceSet) {
                    Event recurringEvent = new Event();
                    recurringEvent.update(e);
                    recurringEvent.setDtStart((ZonedDateTime) recurringPeriod.getStart());
                    recurringEvent.setDtEnd((ZonedDateTime) recurringPeriod.getEnd());
                    recurringEvent.setParent(e);

                    // Map the recurring event and assign a unique ID
                    Map record = entityMapped(recurringEvent);
                    record.put("id", e.getId() + "_" + index++);

                    records.add(record);
                }
            }
        }
        
        return records;
    }

    /**
     * Retrieves a list of events in the specified date range and groups for printing purposes.
     * 
     * @param start The start date and time of the range.
     * @param end The end date and time of the range.
     * @param groups The list of group IDs to filter events.
     * @return A list of mapped events for printing.
     */
    public List<Map> eventsInRangePrint(ZonedDateTime start, ZonedDateTime end, List<Long> groups) {
        // Retrieve detailed events in range and convert to printable format
        List<Map> records = eventsInRange(start, end, groups, true)
                .stream()
                .map((event) -> {
                    // Parse start and end times
                    ZonedDateTime dtstart = ZonedDateTime.parse((String) event.get("dtstart"));
                    ZonedDateTime dtend = ZonedDateTime.parse((String) event.get("dtend"));

                    // Calculate event duration
                    if (event.get("all_day") != null && (Boolean) event.get("all_day")) {
                        event.put("duration", Double.valueOf(0));
                    } else {
                        Duration duration = Duration.between(dtstart, dtend);

                        // Calculate hours and minutes
                        long totalMinutes = duration.toMinutes();
                        long hours = totalMinutes / 60;
                        long minutes = totalMinutes % 60;

                        // Round minutes to the nearest 15-minute interval
                        long roundedMinutes = Math.round(minutes / 15.0) * 15;

                        // Adjust hours if rounded minutes reach 60
                        if (roundedMinutes == 60) {
                            hours += 1;
                            roundedMinutes = 0;
                        }

                        // Calculate the final rounded duration in hours
                        Double roundedHours = hours + (roundedMinutes / 60.0);
                        
                        event.put("duration", roundedHours);
                    }

                    // Format start and end times
                    event.put("dtstart", formatZDT(Locale.ITALY, dtstart));
                    event.put("dtend", formatZDT(Locale.ITALY, dtend));
                    
                    // Usefull for sorting
                    event.put("dtstart_iso", event.get("dtstart"));

                    return event;
                })
                .collect(Collectors.toList());

        // Define a comparator for sorting records by employee name and event type
        Comparator<Map> comparator = 
                Comparator.comparing((Map m) -> (String) m.get("employee_fullname") != null ? (String) m.get("employee_fullname") : "")
                .thenComparing(m -> (String) m.get("type") != null ? (String) m.get("type") : "")
                .thenComparing(m -> (String) m.get("dtstart_iso") != null ? (String) m.get("dtstart_iso") : "");

        // Sort records based on the defined comparator
        records.sort(comparator);

        return records;
    }

    /**
     * Maps an Event entity to a map of key-value pairs.
     * 
     * @param e The Event entity to map.
     * @return A map of key-value pairs representing the event.
     */
    private Map<String, Object> entityMapped(Event e) {
        // Map the event entity to a map using a utility function
        Map record = entityToMap(e);
        Employee employee = e.getEmployee();
        
        // Add employee information if available
        if (employee != null) {
            record.put("color", employee.getColor());
            record.put("employee_fullname", employee.getFullname());
        }

        // Add customer name as title if available
        record.put("title", e.getCustomer() != null ? e.getCustomer().getName() : null);

        return record;
    }
}
