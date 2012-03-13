package controllers;
 
import play.*;
import play.mvc.*;

import models.*;
 
@CRUD.For(AssignedTimeslot.class)
public class CRUDTimeslotAssignments extends CRUD
{ 
   public String toString()
   {
      return "Assigned Timeslot";
   }
}
