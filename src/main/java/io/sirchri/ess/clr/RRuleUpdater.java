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
package io.sirchri.ess.clr;

import io.sirchri.ess.model.Event;
import io.sirchri.ess.repository.EventRepository;
import static io.sirchri.ess.repository.specification.EventSpecifications.recurring;
import static io.sirchri.ess.util.EventUtils.eventToRRuleString;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


@Component
public class RRuleUpdater implements CommandLineRunner {
    private static final Logger logger = LoggerFactory.getLogger(RRuleUpdater.class);
    
    @Autowired
    private EventRepository eventRepository;

    @Override
    public void run(String... args) throws Exception {
        List<Event> recurringEvents = eventRepository.findAll(recurring());
        //logger.info("found {} events with empty rrule", recurringEvents.size());
        
        for (Event e : recurringEvents) {
            if (StringUtils.isEmpty(e.getRrule())) {
                e.setRrule(eventToRRuleString(e));

                eventRepository.save(e);
            }
        }
    }
}