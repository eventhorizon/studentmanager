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

Date.prototype.getWeek = function() {
	var onejan = new Date(this.getFullYear(),0,1);
	return Math.ceil((((this - onejan) / 86400000) + onejan.getDay())/7);
	} 

var startDate = new Date(2012, 0, 1);
var   endDate = new Date(2012,11,31);

var getDOS = function(date) {
   return Math.ceil( (date - startDate ) / 86400000);
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

function sortfunc(a,b)
{
	return teams[a.requester.team.id].fullName.localeCompare(teams[b.requester.team.id].fullName);
}

var teams = new Array();

function createGraphic()
{  
   teams = new Array();
   teamIds = new Array();
   var tteams = theData.teams;
   for(var i = 0; i < tteams.length; i++) {
      teams[tteams[i].id] = { "name":tteams[i].name, "fullName": tteams[i].name, "parentId": tteams[i].parent != null ? tteams[i].parent.id : null};
      teamIds[i] = tteams[i].id;
   }
   for(var i = 0; i < teamIds.length; i++) {
      teams[teamIds[i]].fullName = findName(teamIds[i]);
   }
   
   var startMillis = startDate;
   var   endMillis =   endDate;
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
   
   var data = theData.requests.sort(sortfunc);

   iPos = 25;

   for(var i=0; i < data.length; i++)
   { 
      jPos = 0;
      
      var      x = (getDOS(data[i].startDate)                             - 1) * pixelPerDay;
      var  width = (getDOS(data[i].  endDate) - getDOS(data[i].startDate) + 1) * pixelPerDay;

      var      y = iPos+jPos;
      var height = 0;

      jPos += 30;

      var approvedCoords = new Array();
      for(var j=0; j < data[i].assignedTimeslots.length; j++)
      {
          var      jx = (getDOS(data[i].assignedTimeslots[j].startDate)                                                  - 1) * pixelPerDay;
          var  jwidth = (getDOS(data[i].assignedTimeslots[j].  endDate) - getDOS(data[i].assignedTimeslots[j].startDate) + 1) * pixelPerDay;

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
   
   $(".datepicker").datepicker();
   $(".datepicker.start").change( function() {
	   startDate = new Date($('.datepicker.start').datepicker( "getDate" ));
	   update();
   });
   $(".datepicker.end"  ).change( function() {
	     endDate = new Date($('.datepicker.end'  ).datepicker( "getDate" ));
	   update();
   });
   

   $(".datepicker.start").datepicker( "setDate" , startDate );
   $(".datepicker.end"  ).datepicker( "setDate" ,   endDate );
   
});
