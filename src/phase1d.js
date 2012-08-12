var width = 640;
var height = 480;

var Canvas = require('canvas')
  , canvas = new Canvas(width, height)
  , ctx = canvas.getContext('2d')
  , fs = require('fs');

function drawLine(context, fromX, fromY, toX, toY)
{
	context.strokeStyle = "#ffffff";
	context.beginPath();
	context.moveTo(fromX, fromY);
	context.lineTo(toX, toY);
	context.stroke();
	context.save();
}

function drawConnectedPoints(context, points)
{
	context.strokeStyle = "#ffffff";
	context.beginPath();
	context.moveTo(points[0].x, points[0].y);
	
	var loopLength = points.length;
	for(var i=1; i<loopLength; i++)
	{
		context.lineTo(points[i].x, points[i].y);
	}
	
	context.stroke();
	context.save();
}

function plotPoint(x, y)
{
		var point = {};
		point.x = x;
		point.y = y;
		return point;
}

function f_log(x, r)
{
  return(4.0 * r * 	x * (1.0 - x));
}

ctx.fillRect(0,0,640,480);   // Draw a rectangle with default settings
ctx.save();                  // Save the default state

//

var no_of_points = 100;
var interval = width/(no_of_points - 1);
var r = 1;
var x0 = 0.123456;
var x = x0;
var y;
var points = [];
var maxValue = 0;
var xPlot = 0;

for(var i=0; i<no_of_points; i++)
{
	y = f_log(x, r);
	
	maxValue = Math.max(maxValue, y);
	
	points.push( plotPoint(xPlot, y) );
	x = y;
	xPlot += interval;	
}

var yScale = 0.8 * height/maxValue;

for(var i=0; i<no_of_points; i++)
{
	points[i].y = (height - (points[i].y * yScale) );
}

drawConnectedPoints(ctx, points);

var out = fs.createWriteStream(__dirname + '/../output/state.png')
  , stream = canvas.createPNGStream();

stream.on('data', function(chunk){
  out.write(chunk);
});