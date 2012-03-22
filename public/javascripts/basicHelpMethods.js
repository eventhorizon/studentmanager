Date.prototype.getWeek = function()
{
   var onejan = new Date(this.getFullYear(), 0, 1);
   return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()) / 7);
}

function attachCssClass(raphaelObject, cssClassName)
{
   $(raphaelObject.node).removeAttr('fill').removeAttr('stroke').removeAttr('style');
   raphaelObject.node.className ? raphaelObject.node.className.baseVal = cssClassName
                                : raphaelObject.node.setAttribute('class', cssClassName);
}