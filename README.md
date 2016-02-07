# Formative Components Project

## Specs

* Use Meteor and React
* Make a component that allows you to draw on the canvas 
* Make a component that allows you to input mathmatical symbols.

## Drawing Canvas

### Canvas Specs

* Should take id (as prop) of the canvas or create new canvas if empty
* Should take the hieght and width of the Canvas as props
* Should create a canvas and alert if using outdated broswer
* Should get ids from Canvas of lines, linesToGrey, linesToErase
* Should observe "line collections"
* Should keep track of "isDrawing" using state or global
* Should accept "isErasing" as prop
* Should define logic for startDrawing, whileDrawing, and endDrawing
* Should define logic for collision detection
* Should define logic for drawing a line and helper functions


### Canvas steps

* 
## Math Input






### Notes

While completing more research, I discovered another way to filter the paths.

Right now, I'm asking if the new 'x' or 'y' coordinate are 15pts away from the previous pts. If they are, I assume they are okay to add to the points.

However, the metric that I should be looking at is if they are a certain square magitude away.