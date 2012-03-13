package models;

import java.util.*;

import play.db.jpa.*;
import play.data.validation.*;
import javax.persistence.*;
import java.math.*;

@Entity
public class TimeslotRequest extends Timeslot {
    
    @Required
    @ManyToOne
    public Employee requester;

    //@Required
    //@ManyToOne
    //public Student student;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "timeslotRequest")
    public Collection<AssignedTimeslot> assignedTimeslots;
 
    public String toString() {
        return super.toString() + " " + ( requester != null ? requester : "" ) /* + ", student: " + ( student != null ? student : "" ) */;
    }
    
}
