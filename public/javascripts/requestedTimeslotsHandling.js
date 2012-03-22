var teamsForSorting;

function sortRequestedTimeslots(a,b)
{
   return teamsForSorting[a.requester.team.id].fullName.localeCompare(teamsForSorting[b.requester.team.id].fullName);
}

function initRequestedTimeslots(requestedTimeslots, teams)
{
   teamsForSorting = teams;
   return requestedTimeslots.sort(sortRequestedTimeslots);
}