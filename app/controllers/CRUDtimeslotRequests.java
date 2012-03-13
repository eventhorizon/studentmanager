package controllers;
 
import play.*;
import play.mvc.*;

import models.*;
 
@CRUD.For(TimeslotRequest.class)
public class CRUDtimeslotRequests extends CRUD
{ 
   public String toString()
   {
      return "Timeslot Requests";
   }
}
