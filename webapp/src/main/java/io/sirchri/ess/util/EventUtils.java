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

package io.sirchri.ess.util;

import io.sirchri.ess.model.Event;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import net.fortuna.ical4j.model.DateList;
import net.fortuna.ical4j.model.Recur;
import net.fortuna.ical4j.model.WeekDay;
import net.fortuna.ical4j.model.component.VEvent;
import net.fortuna.ical4j.model.property.ExDate;
import net.fortuna.ical4j.model.property.RRule;
import net.fortuna.ical4j.model.property.RecurrenceId;
import net.fortuna.ical4j.model.property.Sequence;
import net.fortuna.ical4j.model.property.Uid;
import net.fortuna.ical4j.transform.recurrence.Frequency;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author clondero
 */
public class EventUtils {
    private static final Logger logger = LoggerFactory.getLogger(EventUtils.class);
    
    public static String eventToRRuleString(Event e) {
        if(!e.getRecurring())
            return null;
        
        Recur.Builder<ZonedDateTime> builder = new Recur.Builder<>();
        
        List<Frequency> freqs = Arrays.asList(Frequency.YEARLY, Frequency.MONTHLY, Frequency.WEEKLY, Frequency.DAILY);
        List<WeekDay> weekDays = Arrays.asList(WeekDay.SU, WeekDay.MO, WeekDay.TU, WeekDay.WE, WeekDay.TH, WeekDay.FR, WeekDay.SA);
                
        builder.frequency(freqs.get(e.getFrequency()));
        builder.interval(e.getInterval());
        
        if (e.getByweekday() != null)
            builder.dayList(e.getByweekday().stream().map(weekDays::get).collect(Collectors.toList()));
        
        if (e.getUntilDate() != null && e.getUntilType() == 1)
            builder.until(Instant.ofEpochMilli(e.getUntilDate().getTime()).atZone(ZoneId.of(e.getTimezone())));
        
        if (e.getUntilOccurrences() != null && e.getUntilType() == 2)
            builder.count(e.getUntilOccurrences());
        
        return builder.build().toString();
    }    
    
    public static VEvent eventToVevent(Event e) {
        VEvent vevent = new VEvent(
           e.getDtStart().withZoneSameInstant(ZoneId.of(e.getTimezone())), 
            e.getDtEnd().withZoneSameInstant(ZoneId.of(e.getTimezone())), //prende utc e ci applica il timezone (stesso istante di tempo)
        e.getSummary())
            .withProperty(new Uid(e.getUid()))
            .withProperty(new Sequence(e.getSequence()))
            .getFluentTarget();
        
        if (e.getRecurrenceId() != null) {
            vevent.add(new RecurrenceId(e.getRecurrenceId().withZoneSameInstant(ZoneId.of(e.getTimezone()))));
        }
        
        if (e.getExDates() != null) {
            vevent.add(new ExDate(new DateList<>(Arrays.asList(e.getExDates().split(",")).stream().map(d->
                    ZonedDateTime.parse(d).withZoneSameInstant(ZoneId.of(e.getTimezone()))
            ).collect(Collectors.toList()))));
        }
            
        if (e.getRecurring()) {
            vevent.add(new RRule(eventToRRuleString(e)));
        }
        
        return vevent;
    }
}
