package models;

import java.util.*;

import play.db.jpa.*;
import play.data.validation.*;
import javax.persistence.*;

import java.math.*;

@Entity
public class AssignedTimeslot extends Timeslot {
    
    @Required
    @ManyToOne
    public TimeslotRequest timeslotRequest;
    
    @Required
    @ManyToOne
    public Student student;
 
    public String toString() {
        return "student: " + student + " - request: " + timeslotRequest;
    }
}
