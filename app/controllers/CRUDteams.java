package controllers;
 
import play.*;
import play.mvc.*;

import models.*;
 
@CRUD.For(Team.class)
public class CRUDteams extends CRUD
{ 
   public String toString()
   {
      return "Gruppen";
   }
}
