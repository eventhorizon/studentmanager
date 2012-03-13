package models;

import java.util.*;

import play.db.jpa.*;
import play.data.validation.*;
import javax.persistence.*;
import java.math.*;
import java.text.*;

@Entity
public class Timeslot extends Model
{    
   @Temporal(TemporalType.DATE)
   public Date startDate;

   @Temporal(TemporalType.DATE)
   public Date endDate;
 
   public String toString() {
      DateFormat df = DateFormat.getDateInstance(DateFormat.MEDIUM);
      return ( startDate != null ? df.format( startDate ) : "" ) + " to " + 
             (   endDate != null ? df.format(   endDate ) : "" );
   }   
}

