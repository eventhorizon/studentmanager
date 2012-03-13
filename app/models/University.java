package models;

import java.util.*;

import play.db.jpa.*;
import play.data.validation.*;
import javax.persistence.*;
import java.math.*;

@Entity
public class University extends Model {
    
    @Required
    @MaxSize(50)
    public String name;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "university")
    public Collection<Student> students;

    public String toString() {
        return ( name != null ? name : "" );
    }
    
}
