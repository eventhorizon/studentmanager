var teamScopes_oldRequest;
var teamScopes_teams;
var teamScopes_activeTeamIds = new Array();
var teamScopes_activeTeamIdStarts = new Array();

function initTeamScopes(teams)
{
   teamScopes_teams = teams;
}

function enteringRequestRendering(request, currentYEnd)
{
   var nextTeam = teamScopes_teams[request.requester.team.id];
   var parents = teamScopes_teams[request.requester.team.id].structure;
   return updateScopes(parents, currentYEnd);

}

function finishedRequestRendering(currentYEnd)
{
   return updateScopes([], currentYEnd);
}

function updateScopes(parents, currentYEnd)
{
   var scopeFinished = 0;

   var newTeamScopes_activeTeamIds = new Array();
   var newTeamScopes_activeTeamIdStarts = new Array();

   for( var i = 0; i < teamScopes_activeTeamIds.length; i++)
   {
      var pos = $.inArray(teamScopes_activeTeamIds[i], parents)

      if(pos < 0)
      {

         if(!scopeFinished)
         {
            scopeFinished = 1;
         }

         closeScope(i, currentYEnd);
      } else
      {
         newTeamScopes_activeTeamIds.push(teamScopes_activeTeamIds[i]);
         newTeamScopes_activeTeamIdStarts.push(teamScopes_activeTeamIdStarts[i]);
      }
   }

   teamScopes_activeTeamIds = newTeamScopes_activeTeamIds;
   teamScopes_activeTeamIdStarts = newTeamScopes_activeTeamIdStarts;

   for( var i = 0; i < parents.length; i++)
   {
      if($.inArray(parents[i], teamScopes_activeTeamIds) < 0)
      {
         teamScopes_activeTeamIds.push(parents[i]);
         teamScopes_activeTeamIdStarts.push(currentYEnd + yStartOffset);

         if(!scopeFinished)
         {
            scopeFinished = 1;
         }
      }
   }

   return scopeFinished;
}

function closeScope(index, currentYEnd)
{
   var teamId = teamScopes_activeTeamIds[index];
   var level = teamScopes_teams[teamId].structure.length;
   var ystart = teamScopes_activeTeamIdStarts[index];
   var naming = teamScopes_teams[teamId].name;

   paintme(level, ystart, currentYEnd, naming, teamId);
}

var yOffset = 10;
var offsetEachLevel = 5;
var widthEachLevel = 25;
var borderRad = 3;
var yStartOffset = 5;

function paintme(level, salYStart, salYEnd, naming, teamId)
{
   var salXOffset = level * offsetEachLevel + (level - 1) * widthEachLevel;
   var salHeight = salYEnd - salYStart;

   var jrect = paper.rect(salXOffset, salYStart, widthEachLevel, salHeight, borderRad);
   attachCssClass(jrect, 'outerSortArea');
   $(jrect.node).data("team_id", teamId);
   jrect.click(clickCallbackTeam);

   var text = paper.text(salXOffset + (widthEachLevel / 2), salYEnd - (salHeight / 2), naming);
   attachCssClass(text, 'outerSortText');
   $(text.node).data("team_id", teamId);
   text.click(clickCallbackTeam);
   
   text.rotate(270, salXOffset + (widthEachLevel / 2), salYEnd - (salHeight / 2));
}
