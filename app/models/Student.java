package models;

import java.util.*;

import play.db.jpa.*;
import play.data.validation.*;
import javax.persistence.*;

import java.math.*;

@Entity
public class Student extends Person {
    
    @Required
    @ManyToOne
    public University university;
    
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "student")
    public Collection<AssignedTimeslot> assignedTimeslots;
 
    public String toString() {
        return super.toString() + " ( " + (university != null ? university : "") + " )";
    }
    
}
