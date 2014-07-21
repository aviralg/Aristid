ARISTID
=======
Aristid aims to make it easy to generate high quality fractals.
The idea is to have all the well known fractals and allow users to configure their parameters and download them.
As of now Aristid only supports 2D fractals.


STATE
=====
Copy the remaining fractals from Fractals.js to index.html
Make correction a function of order. This is useful for sierpinski's triangle as it changes orientation based on order.
Certain fractals have not been copied from the book. Copy them.
When the user lands on the page, show a pop up asking him which fractal he wants to draw.
When the fractal is drawn show a pop up with a link to the canvas.toDataURL() for now.


ENHANCEMENTS
============
Canvas Context Properties - Expose basic properties to the user, such as antialiasing, stroke width, foreground colors, background colors.
Colors - Find the leaf count from the compute_bounds function and use that to provide a multicolor image, possibly use matplotlib colormaps.
Pop Up - After preprocessing ask the user if they want to continue in case the number of points is huge.
Expose the list of coordinates to the user in various formats such as python, Javascript, C etc.
Create a gallery page to list all the fractals in different colors and orders
Create a performance page which draws all fractals in different orders and generates a graph of time vs points.

PROBLEMS
========
How to download bitmap images using only Javascript ?
There is significant repetition in code. The preprocessing and processing stage are essentially copies of each other. I wonder if I can abstract the recursion from the operations.
CURLY_BRACE should be SQUARE_BRACKET. In fact it should be called REINSTATE to emphasize the operation rather than character. This means I can also use a different character for the same operation.


FACTS
=====
Calling context.stroke only once as opposed to calling it for every new point, makes a huge difference in performance.


BUGS
====
None, as of now.
