package controllers;
 
import play.*;
import play.mvc.*;

import models.*;
 
@CRUD.For(University.class)
public class CRUDuniversities extends CRUD
{ 
   public String toString()
   {
      return "Universities";
   }
}
