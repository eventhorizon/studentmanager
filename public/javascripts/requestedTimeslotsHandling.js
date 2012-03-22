var teamsForSorting;

function sortRequestedTimeslots(a,b)
{
   var sortResult = teamsForSorting[a.requester.team.id].fullName.localeCompare(teamsForSorting[b.requester.team.id].fullName);
   if( sortResult == 0 )
   {
      var nameA = a.requester.lastName + ", " + a.requester.firstName;
      var nameB = b.requester.lastName + ", " + b.requester.firstName;
      
      sortResult = nameA.localeCompare(nameB);
   }
   
   return sortResult;
}

function initRequestedTimeslots(requestedTimeslots, teams)
{
   teamsForSorting = teams;
   return requestedTimeslots.sort(sortRequestedTimeslots);
}