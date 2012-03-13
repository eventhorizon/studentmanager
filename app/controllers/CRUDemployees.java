package controllers;
 
import play.*;
import play.mvc.*;

import models.*;
 
@CRUD.For(Employee.class)
public class CRUDemployees extends CRUD
{ 
   public String toString()
   {
      return "Employees";
   }
}
