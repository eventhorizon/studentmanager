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

function createSAL1(salYStart, salYEnd, teams, teamId)
{
   var salXOffset   = 10;
   var salWidth     = 25;
   var salBorderRad = 3;
   
   var salHeight = salYEnd - salYStart;
   
   var jrect = paper.rect(salXOffset, salYStart, salWidth, salHeight, salBorderRad);
   attachCssClass(jrect, 'outerSortArea');
   
   var teamFullName = teams[teamId].fullName; 
   var text = paper.text(salXOffset + (salWidth / 2), salYEnd - (salHeight / 2), teamFullName);
   attachCssClass(text, 'outerSortText');
   //$(text.node).data("team_id", teamId);
   text.attr({ 'text-anchor' : 'left' });
   // text.click(clickCallbackRequestedTimeslot);
}

function createSAL2(salYStart, salYEnd, requester)
{
   var salXOffset   = 40;
   var salWidth     = 25;
   var salBorderRad = 3;
   
   var salHeight = salYEnd - salYStart;
   
   var jrect = paper.rect(salXOffset, salYStart, salWidth, salHeight, salBorderRad);
   attachCssClass(jrect, 'innerSortArea');
   
   var requesterFullName = requester.lastName + ", " + requester.firstName; 
   var text = paper.text(salXOffset + (salWidth / 2), salYEnd - (salHeight / 2), requesterFullName);
   attachCssClass(text, 'innerSortArea');
   //$(text.node).data("requester_id", teamId);
   text.attr({ 'text-anchor' : 'left' });
   // text.click(clickCallbackRequestedTimeslot);
}

function createGraphic()
{
   var teams = initTeams(theData.teams);
   var data  = initRequestedTimeslots(theData.requests, teams);

   paper.clear();
   var pixelPerDay = initTimelineHeadlines(startDate, endDate, theWidth, paper);

   iPos = 25;
   // sal1 = Sort Area Level 1
   var sal1YStart    = iPos - 3;
   var sal1YEnd      = iPos - 3;
   var currentTeamId;
   var sal2YStart    = iPos - 3;
   var sal2YEnd      = iPos - 3;
   var currentRequesterId;

   for( var i = 0; i < data.length; i++)
   {
      var sal1Finished = currentTeamId      != null && currentTeamId      != data[i].requester.team.id;
      var sal2Finished = currentRequesterId != null && currentRequesterId != data[i].requester.id;
      
      if(sal1Finished || sal2Finished)
         {
         iPos += 10;
         }
      
      // If all requests of an old team are rendered and the current run has a new team,
      // Paint the team's rect.
      if(sal1Finished)
      {
         createSAL1(sal1YStart, iPos - 12, teams, currentTeamId);
         sal1YStart = iPos - 5;

      }
      currentTeamId = data[i].requester.team.id;
      

      // If all requests of a requester are rendered and the current run has a new requester,
      // Paint the requester's rect.
      if(sal2Finished)
      {
         createSAL2(sal2YStart, iPos - 12, data[i-1].requester);
         sal2YStart = iPos - 5;

      }
      currentRequesterId = data[i].requester.id;
      

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

      // finalize outer sort
      if(i >= data.length - 1)
      {
         iPos += 10;
         createSAL1(sal1YStart, iPos - 12, teams, currentTeamId);
         createSAL2(sal2YStart, iPos - 12, data[i-1].requester);
      }
   }

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
