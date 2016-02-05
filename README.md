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

Canvases = new Mongo.Collection('canvases');

Canvas.insert({
  
}, (err, nID) => {
  
})

I think the way I will structure the data is by making collections for "Canvases" that will store the id reference to the related location of its lines, linesToGrey, and linesToErase.

This will allow me to "observe" each of the line types separately.

