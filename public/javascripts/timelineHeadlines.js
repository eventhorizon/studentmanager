function initTimelineHeadlines(startDate, endDate, theWidth, paper)
{
   var   startMillis = startDate;
   var     endMillis = endDate;
   var   shownMillis = endMillis.getTime() - startMillis.getTime();
   var  oneDayMillis = 24 * 60 * 60 * 1000;
   var oneWeekMillis = 7 * oneDayMillis;

   var pixelTotal   = theWidth;
   var pixelPerDay  = pixelTotal / (shownMillis / oneDayMillis);
   var pixelPerWeek = 7 * pixelPerDay;

   for( var i = 0; i < Math.ceil(shownMillis / oneWeekMillis); i++)
   {
      var rect = paper.rect(i * pixelPerWeek, 0, pixelPerWeek, 20);
      attachCssClass(rect, 'weekBlocks');
      var text = paper.text(i * pixelPerWeek + (pixelPerWeek / 2), 10, 'W' + ((i % 52) + 1));
      attachCssClass(text, 'weekBlocks');
   }

   return pixelPerDay;
}