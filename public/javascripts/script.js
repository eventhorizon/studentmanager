clickCallbackRequestedTimeslot = function(event)
{
   var theId = '';
   
   if(event.target.nodeName.toLowerCase() === 'tspan')
   {
      theId = $(event.target).parent().data( "req_id" );
   }
   else
   {
      theId = $(event.target).data( "req_id" );
   }
   
   $("#jquiDialog > iframe").attr("src", '../admin/crudtimeslotrequests/' + theId);
   jquiDialog.dialog( "option", "title", 'Modify Request...' );
   jquiDialog.dialog('open');
}

clickCallbackAssignedTimeslot = function(event)
{
   var theId = '';
   
   if(event.target.nodeName.toLowerCase() === 'tspan')
   {
      theId = $(event.target).parent().data( "ass_id" );
   }
   else
   {
      theId = $(event.target).data( "ass_id" );
   }
   
   $("#jquiDialog > iframe").attr("src", '../admin/crudtimeslotassignments/' + theId);
   jquiDialog.dialog( "option", "title", 'Modify Assignment...' );
   jquiDialog.dialog('open');
}

function update() {
   $.ajax({
     url: '../timeslotRequests/listEnhanced/',
     dataType: 'json',
     success:
        function( data, textStatus, jqXHR )
        {
           theData = eval(data);
           createGraphic();
        },
     error:
        function( jqXHR, textStatus, errorThrown )
        {
           console.log('ERROR!');
           console.log(jqXHR);
           console.log(textStatus);
           console.log(errorThrown);
        }
   });
}

Date.prototype.getDOY = function() {
   var onejan = new Date(this.getFullYear(),0,1);
   return Math.ceil((this - onejan) / 86400000);
}

function attachCssClass(raphaelObject, cssClassName)
{
   $(raphaelObject.node).removeAttr('fill').removeAttr('stroke').removeAttr('style');
   (raphaelObject.node.className ? raphaelObject.node.className.baseVal = cssClassName : raphaelObject.node.setAttribute('class',  cssClassName));
}



var teams;
var teamIds;

function findName(id) {
   if( teams[id].parentId == null) {
      return teams[id].name;
   }
   return findName(teams[id].parentId) + " / " + teams[id].name;
}


function createGraphic()
{
   var data = theData.requests;
   
   teams = new Array();
   teamIds = new Array();
   //var teams = new Array();
   //var teamIds = new Array();
   var tteams = theData.teams;
   for(var i = 0; i < tteams.length; i++) {
      //console.log(tteams[i].id);
      teams[tteams[i].id] = { "name":tteams[i].name, "fullName": tteams[i].name, "parentId": tteams[i].parent != null ? tteams[i].parent.id : null};
      teamIds[i] = tteams[i].id;
   }
   for(var i = 0; i < teamIds.length; i++) {
      teams[teamIds[i]].fullName = findName(teamIds[i]);
      //console.log(teams[teamIds[i]].fullName);
   }
   
   
   
   
   var startMillis = new Date(2012, 0, 1, 0, 0, 0, 0);
   var   endMillis = new Date(2013, 0, 1, 0, 0, 0, 0);
   var shownMilli  = endMillis.getTime() - startMillis.getTime();
   var oneDayMillis = 24*60*60*1000;
   var oneWeekMillis = 7*oneDayMillis;

   var pixelTotal   = theWidth;
   var pixelPerDay  = pixelTotal / (shownMilli / oneDayMillis);
   var pixelPerWeek = 7*pixelPerDay;

   paper.clear();

   for(var i = 0; i < Math.ceil(shownMilli/oneWeekMillis); i++)
   {
      var rect = paper.rect(i * pixelPerWeek, 0, pixelPerWeek, 20);
      attachCssClass(rect, 'weekBlocks');
      var text = paper.text(i * pixelPerWeek + (pixelPerWeek/2), 10, 'W'+((i%52)+1));
      attachCssClass(text, 'weekBlocks');
   }

   iPos = 25;

   for(var i=0; i < data.length; i++)
   { 
      jPos = 0;

      var      x = (new Date(data[i].startDate).getDOY()                            - 1) * pixelPerDay;
      var  width = (new Date(data[i].endDate).getDOY()     - new Date(data[i].startDate).getDOY()  + 1) * pixelPerDay;

      var      y = iPos+jPos;
      var height = 0;

      jPos += 30;

      var approvedCoords = new Array();
      for(var j=0; j < data[i].assignedTimeslots.length; j++)
      {
         var      jx = (new Date(data[i].assignedTimeslots[j].startDate).getDOY()                                 - 1) * pixelPerDay;
         var  jwidth = (new Date(data[i].assignedTimeslots[j].endDate).getDOY() - new Date(data[i].assignedTimeslots[j].startDate).getDOY()  + 1) * pixelPerDay;

         var      jy = iPos + jPos;
         var jheight = 20;

         approvedCoords.push({x: jx, y:jy, w:jwidth, h:jheight});

         jPos += 25;
      }

      iPos +=5;
      height = iPos+jPos-y;

      var rect = paper.rect(x, y, width, height, 10);
      attachCssClass(rect, 'requested');
      
      var text = paper.text(x + (width/2), y+15, data[i].requester.firstName + ' ' + data[i].requester.lastName + ' (' + teams[data[i].requester.team.id].fullName + ')');
      attachCssClass(text, 'requested');
      $(text.node).data( "req_id", data[i].id );
      text.click(clickCallbackRequestedTimeslot);

      for(var j=0; j < approvedCoords.length; j++)
      {
         var jrect = paper.rect(approvedCoords[j].x, approvedCoords[j].y, approvedCoords[j].w, approvedCoords[j].h, 5);
         attachCssClass(jrect, 'approved');
         $(jrect.node).data( "ass_id", data[i].assignedTimeslots[j].id );
         jrect.click(clickCallbackAssignedTimeslot);

         var jtext = paper.text(approvedCoords[j].x + (approvedCoords[j].w/2), approvedCoords[j].y+(approvedCoords[j].h/2), data[i].assignedTimeslots[j].student.firstName + ' ' + data[i].assignedTimeslots[j].student.lastName);
         attachCssClass(jtext, 'approved');
         $(jtext.node).data( "ass_id", data[i].assignedTimeslots[j].id );
         jtext.click(clickCallbackAssignedTimeslot);
      }

      iPos = y+height+5;
   }
   
   paper.renderfix();
   
   $('svg').attr("height",iPos);
}

var paper;
var iPos = 0;
var jPos = 0;
var jquiDialog;
var theWidth;
var theData;

function preparePaper()
{
   var newWidth = window.innerWidth;
   if( newWidth > 1366 || theWidth != 1366) {
      if(newWidth <= 1366 ) {
         theWidth = 1366;
      }
      else {
         theWidth = newWidth;
      }
      
      if( paper ) {
         paper.remove();
      }
      
      paper = Raphael('graphic', theWidth, 10000);
      $('svg').removeAttr('height');

      return 1;
   }
   return 0;
}

$(document).ready(function() {
   
   preparePaper();
   update();
   
   jquiDialog = $('#jquiDialog').dialog(
      {
         autoOpen: false,
         closeOnEscape: true,
         modal:true,
         width:'1040',
         close: function(event, ui)
            {
               update();
               $("#jquiDialog > iframe").attr("src", 'about:blank');
            }
      }
   );
   
   $(window).resize(
      $.debounce(
         function() {
            if( preparePaper() ) {
               createGraphic();
            }
         },
         300
      )
   );
});