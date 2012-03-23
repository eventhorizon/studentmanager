/*
 * This file holds everything required for click callback handling.
 */

/*
 * This function is able to create a standard callback with opening a popup.
 */
function handleClickForPopupCallback(event, parentIdAttributeName, url, title)
{
   var theId = '';

   if(event.target.nodeName.toLowerCase() === 'tspan')
   {
      theId = $(event.target).parent().data(parentIdAttributeName);
   } else
   {
      theId = $(event.target).data(parentIdAttributeName);
   }

   jquiDialogIframe.attr('src', url + theId);
   jquiDialog.dialog('option', 'title', title);
   jquiDialog.dialog('open');
}

/*
 * Concrete callback for click event on requested timeslot.
 */
function clickCallbackRequestedTimeslot(event)
{
   handleClickForPopupCallback(event, 'req_id', '../admin/crudtimeslotrequests/', 'Modify Request');
}

/*
 * Concrete callback for click event on assigned timeslot.
 */
function clickCallbackAssignedTimeslot(event)
{
   handleClickForPopupCallback(event, 'ass_id', '../admin/crudtimeslotassignments/', 'Modify Assignment');
}

/*
 * Concrete callback for click event on teams.
 */
function clickCallbackTeam(event)
{
   handleClickForPopupCallback(event, 'team_id', '../admin/crudteams/', 'Modify Team');
}

/*
 * Main config.
 */
var jquiDialog;
var jquiDialogIframe;

$(document).ready(function()
   {
      jquiDialogIframe = $('#jquiDialog > iframe');
      jquiDialog       = $('#jquiDialog').dialog({
         autoOpen      : false,
         closeOnEscape : true,
         modal         : true,
         width         : '1040',
         close         : function(event, ui)
                         {
                            update();
                            jquiDialogIframe.attr('src', 'about:blank');
                         }
   });
});
