package controllers;

import java.util.Collection;

import models.Team;
import flexjson.JSONSerializer;
import play.mvc.Controller;
import play.mvc.WebSocketController;

public class Teams extends Controller
{
   /** The live stream. */
   public static play.libs.F.EventStream liveStream = new play.libs.F.EventStream();

   /**
    * The Class WebSocket.
    */
   public static class WebSocket extends WebSocketController {

      /**
       * Live searches.
       */
      public static void stream() {
         while (inbound.isOpen()) {
            try {
               //Logger.info("Waiting for next search...");
               String search = await(liveStream.nextEvent());
               if (search != null) {
                  //Logger.info("Publishing Live Search %s to Outbound Subscribers", search);
                  outbound.send(search);
               }

            } catch (Throwable t) {
               //Logger.error(ExceptionUtil.getStackTrace(t));
            }
         }
      }
      
      public static void send( String json )
      {
         outbound.send(json);
      }
      
      
    
      }
      
      
      
      
  
   

public static void listTeams()
{
   final Collection<Team> teams = Team.findAll();
   
   JSONSerializer teamSerializer =
            new JSONSerializer().include(
               "name",
               "parent.id"
            ).exclude("*");
   
   String returnString = "[";
   
   for( Team team : teams )
   {
      returnString += teamSerializer.serialize( team ) + ", ";
   }
   
   returnString = returnString.substring(0,returnString.length()-2);
   
   returnString += "]";
   WebSocket.send(returnString);
   //renderJSON( returnString );
   
   
}
}
