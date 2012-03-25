function update()
{
   $.ajax({
      url      : '../timeslotRequests/listEnhanced/',
      dataType : 'json',
      success  : function(data, textStatus, jqXHR)
      {
         theData = eval(data);
         createGraphic();
      },
      error : function(jqXHR, textStatus, errorThrown)
      {
         console.log('ERROR!');
         console.log(jqXHR);
         console.log(textStatus);
         console.log(errorThrown);
      }
   });
}

var startDate = new Date(2012,  0,  1);
var   endDate = new Date(2012, 11, 31);

function getDOS(date)
{
   return Math.ceil((date - startDate) / 86400000);
}

function createGraphic()
{
   var teams = initTeams(theData.teams);
   var data  = initRequestedTimeslots(theData.requests, teams);

   paper.clear();
   var pixelPerDay = initTimelineHeadlines(startDate, endDate, theWidth, paper);

   iPos = 25;

   initTeamScopes(teams);
   
   for( var i = 0; i < data.length; i++)
   {
      if (enteringRequestRendering(data[i],iPos)) {iPos += 10;}

      jPos = 0;

      var x = (getDOS(data[i].startDate) - 1) * pixelPerDay;
      var width = (getDOS(data[i].endDate) - getDOS(data[i].startDate) + 1) * pixelPerDay;

      var y = iPos;
      var height = 0;

      jPos += 30;

      var approvedCoords = new Array();
      for( var j = 0; j < data[i].assignedTimeslots.length; j++)
      {
         var jx = (getDOS(data[i].assignedTimeslots[j].startDate) - 1) * pixelPerDay;
         var jwidth = (getDOS(data[i].assignedTimeslots[j].endDate)
               - getDOS(data[i].assignedTimeslots[j].startDate) + 1)
               * pixelPerDay;

         var jy = iPos + jPos;
         var jheight = 20;

         approvedCoords.push({
            x : jx,
            y : jy,
            w : jwidth,
            h : jheight
         });

         jPos += 25;
      }

      iPos += 5;
      height = iPos + jPos - y;

      var rect = paper.rect(x, y, width, height, 10);
      attachCssClass(rect, 'requested');
      $(rect.node).data("req_id", data[i].id);
      rect.click(clickCallbackRequestedTimeslot);

      var text = paper.text(x + (width / 2), y + 15, data[i].requester.firstName + ' '
            + data[i].requester.lastName + ' (' + teams[data[i].requester.team.id].fullName + ')');
      attachCssClass(text, 'requested');
      $(text.node).data("req_id", data[i].id);
      text.click(clickCallbackRequestedTimeslot);

      for( var j = 0; j < approvedCoords.length; j++)
      {
         var jrect = paper.rect(approvedCoords[j].x, approvedCoords[j].y, approvedCoords[j].w,
               approvedCoords[j].h, 5);
         attachCssClass(jrect, 'approved');
         $(jrect.node).data("ass_id", data[i].assignedTimeslots[j].id);
         jrect.click(clickCallbackAssignedTimeslot);

         var jtext = paper.text(approvedCoords[j].x + (approvedCoords[j].w / 2), approvedCoords[j].y
               + (approvedCoords[j].h / 2), data[i].assignedTimeslots[j].student.firstName + ' '
               + data[i].assignedTimeslots[j].student.lastName);
         attachCssClass(jtext, 'approved');
         $(jtext.node).data("ass_id", data[i].assignedTimeslots[j].id);
         jtext.click(clickCallbackAssignedTimeslot);
      }

      iPos = y + height + 5;
   }

   if(finishedRequestRendering(iPos)) {iPos += 10;}

   paper.renderfix();

   $('svg').attr("height", iPos);
}

var paper;
var iPos = 0;
var jPos = 0;
var theWidth;
var theData;

function preparePaper()
{
   var newWidth = window.innerWidth;
   
   if (typeof(document.body.clientWidth) == 'number') {
      newWidth = document.body.clientWidth;
   } else {
      $('#warningArea').show();
      newWidth = window.innerWidth;
   }
   
   if(newWidth > 1366 || theWidth != 1366)
   {
      if(newWidth <= 1366)
      {
         theWidth = 1366;
      } else
      {
         theWidth = newWidth;
      }

      if(paper)
      {
         paper.remove();
      }

      paper = Raphael('graphic', theWidth, 10000);
      $('svg').removeAttr('height');

      return 1;
   }
   return 0;
}

$(document).ready(function()
{
   preparePaper();
   update();

   $(window).resize($.debounce(function()
   {
      if(preparePaper())
      {
         createGraphic();
      }
   }, 300));

   $(".datepicker").datepicker();
   
   $(".datepicker.start").change(function()
   {
      startDate = new Date($('.datepicker.start').datepicker("getDate"));
      update();
   });
   $(".datepicker.end").change(function()
   {
        endDate = new Date($('.datepicker.end'  ).datepicker("getDate"));
      update();
   });

   $(".datepicker.start").datepicker("setDate", startDate);
   $(".datepicker.end"  ).datepicker("setDate", endDate);

});
