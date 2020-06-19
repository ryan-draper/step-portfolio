// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.ArrayList;
import java.util.List;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Set;
import java.util.HashSet;
import java.util.Iterator;
import java.util.ListIterator;

public final class FindMeetingQuery {

  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    /* Basic Idea: default time range is whole day, then we look at each event and if one of the attendees at that event
       is in the new event, then remove the time slot of that event from the new time range. Then go through all the
       remaining time slots and remove ones that are not long enough to hold the meeting. */
    
    // default list of ranges is one range lasting the whole day
    List<TimeRange> ranges = new ArrayList<TimeRange>(Arrays.asList(TimeRange.WHOLE_DAY));
    for(Event event : events) {
      Set<String> intersection = new HashSet<String>(event.getAttendees()); // creates copy of event's attendees set
      intersection.retainAll(request.getAttendees()); // set of common attendees between event and request
      // if someone in the event is also an attendee for the meeting, then consider event
      if(intersection.size() > 0) {
        ListIterator<TimeRange> itr = ranges.listIterator();          
        // use of iterator allows for deletions
        while(itr.hasNext()) {
          TimeRange range = itr.next();
          if((event.getWhen()).overlaps(range)) {
            // if range is completely within event, remove range
            if((event.getWhen()).contains(range)) {
              itr.remove();
            // if event is completely within range, add ranges before and after event and remove original range
            } else if(range.contains(event.getWhen())) {
              TimeRange before = TimeRange.fromStartEnd(range.start(), (event.getWhen()).start(), false);
              TimeRange after = TimeRange.fromStartEnd((event.getWhen()).start() + (event.getWhen()).duration(), range.start() + range.duration(), false);
              itr.remove();
              itr.add(before);
              itr.add(after);
            // if event starts within and ends after range, add range before event and remove original range
            } else if(range.contains((event.getWhen()).start())) {
              TimeRange before = TimeRange.fromStartEnd(range.start(), (event.getWhen()).start(), false);
              itr.remove();
              itr.add(before);
            // if event starts before and ends within range, add range after event and remove original range
            } else {
              TimeRange after = TimeRange.fromStartEnd((event.getWhen()).start() + (event.getWhen()).duration(), range.start() + range.duration(), false);
              itr.remove();
              itr.add(after);
            }
          }
        }
      }
    }
    // remove time slots too short to hold the meeting
    ListIterator<TimeRange> itr = ranges.listIterator();
    while(itr.hasNext()) {
      TimeRange range = itr.next();
      if(range.duration() < request.getDuration()) {
        itr.remove();
      }
    }
    return ranges;
  }

}
