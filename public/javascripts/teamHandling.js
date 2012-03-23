function findName(id, teams)
{
   if(teams[id].parentId == null)
   {
      return teams[id].name;
   }

   return findName(teams[id].parentId, teams) + " / " + teams[id].name;
}

function initTeams(tteams)
{
   var teams   = new Array();
   var teamIds = new Array();

   for( var i = 0; i < tteams.length; i++)
   {
      teams[tteams[i].id] = {
         "name"     : tteams[i].name,
         "fullName" : tteams[i].name,
         "parentId" : tteams[i].parent != null ? tteams[i].parent.id : null
      };
      teamIds[i] = tteams[i].id;
   }

   for( var i = 0; i < teamIds.length; i++)
   {
      teams[teamIds[i]].fullName = findName(teamIds[i], teams);
   }

   attachAllParentsToTeams(teams, teamIds);

   return teams;
}

function attachAllParentsToTeams(teams, teamIds)
{
   for( var i = 0; i < teamIds.length; i++)
   {
      teams[teamIds[i]].structure = createTeamStructure( teamIds[i], teams, teamIds );
   }
}

function createTeamStructure( teamId, teams, teamIds )
{
   var structure = new Array();
   structure.push(teamId);
   if( teams[teamId].parentId != null ) {
      structure.push.apply(structure, createTeamStructure( teams[teamId].parentId, teams, teamIds ));
   }
   return structure;
}
