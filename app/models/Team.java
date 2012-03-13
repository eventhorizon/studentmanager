package models;

import java.util.*;

import play.db.jpa.*;
import play.data.validation.*;
import javax.persistence.*;
import java.math.*;

@Entity
public class Team extends Model {
    
    @Required
    @MaxSize(50)
    public String name;
    
    @ManyToOne
    public Team parent;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "parent")
    public Collection<Team> children;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "team")
    public Collection<Person> assignedPersons;
 
    public String toString() {
        return (parent != null ? parent + " / " : "") + name;
    }
    
}
