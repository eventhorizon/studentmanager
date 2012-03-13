package controllers;
 
import play.*;
import play.mvc.*;

import models.*;
 
@CRUD.For(Student.class)
public class CRUDstudents extends CRUD
{ 
   public String toString()
   {
      return "Students";
   }
}
