package io.sirchri.ess.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "event")
public class Event implements Serializable, GenericEntity<Event> {
    public enum EventType {
        J("j"),
        V("v"),
        P("p"),
        S("s"),
        M("m");

        private final String value;

        EventType(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }

        public static EventType fromValue(String value) {
            for (EventType eventType : EventType.values()) {
                if (eventType.value.equals(value)) {
                    return eventType;
                }
            }
            throw new IllegalArgumentException("Invalid EventType value: " + value);
        }
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private Long id;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "all_day")
    private Boolean allDay;

    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private EventType type;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "hours")
    private Double hours;

    @Column(name = "recurring")
    private Boolean recurring;

    @Column(name = "interval")
    private Integer interval;

    @Column(name = "frequency")
    private Integer frequency;

    @Column(name = "day")
    private List<Integer> byweekday;

    @Column(name = "until")
    private Integer until;

    @Temporal(TemporalType.DATE)
    @Column(name = "until_date")
    private Date untilDate;

    @Column(name = "until_occurrences")
    private Integer untilOccurrences;

    @Column(name = "rrule")
    private String rrule;

    @Column(name = "date")
    private List<LocalDateTime> exDates;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Event parent;

    @Override
    public void update(Event source) {
        this.startDate = source.getStartDate();
        this.endDate = source.getEndDate();
        this.allDay = source.getAllDay();
        this.type = source.getType();
        this.customer = source.getCustomer();
        this.employee = source.getEmployee();
        this.hours = source.getHours();
        this.recurring = source.getRecurring();
        this.interval = source.getInterval();
        this.frequency = source.getFrequency();
        this.byweekday = new ArrayList<>(source.getByweekday());
        this.until = source.getUntil();
        this.untilDate = source.getUntilDate();
        this.untilOccurrences = source.getUntilOccurrences();
        this.rrule = source.getRrule();
        this.exDates = new ArrayList<>(source.getExDates());
        this.parent = source.getParent();
    }

    @Override
    public Event createNewInstance() {
        Event newInstance = new Event();
        newInstance.update(this);
        
        return newInstance;
    }
}