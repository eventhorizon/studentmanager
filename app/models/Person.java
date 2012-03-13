package models;

import java.util.*;

import play.db.jpa.*;
import play.data.validation.*;
import javax.persistence.*;
import java.math.*;

@Entity
public class Person extends Model {
    
    @Required
    @MaxSize(50)
    public String firstName;
    
    @Required
    @MaxSize(50)
    public String lastName;

    @Required
    public String phoneNumber;

    @Email
    @Required
    public String eMail;
    
    @ManyToOne
    public Team team;
 
    public String toString() {
        return ( lastName != null ? lastName : "" ) + ", " + ( firstName != null ? firstName : "" ) + " (" + ( team !=null ? team.name : "" ) + ")";
    }
    
}
