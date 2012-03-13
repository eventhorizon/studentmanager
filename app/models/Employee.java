package models;

import java.util.*;

import play.db.jpa.*;
import play.data.validation.*;
import javax.persistence.*;
import java.math.*;

@Entity
public class Employee extends Person {
    
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "requester")
    public Collection<TimeslotRequest> timeslotRequests;
 
    public String toString() {
        return super.toString();
    }
    
}
