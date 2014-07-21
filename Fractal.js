var PLUS                =   "+";
var MINUS               =   "-";
var LEFT_CURLY_BRACE    =   "[";
var RIGHT_CURLY_BRACE   =   "]";

var Fractal = function Fractal( name
                              , axiom
                              , productions
                              , angle
                              , correction
                              )
{
    this.name            = name;
    this.axiom           = axiom;
    this.productions     = productions;
    this.angle           = angle;
    this.correction      = correction || 0.0;

    this.length          = 10.0;
    this.bounds          = { };


    this.compute_scales = function( order
                          , xdimension
                          , ydimension
                          , xmargin
                          , ymargin
                          )
    {
        var ydiff       = this.bounds[order].ymax - this.bounds[order].ymin;
        var xdiff       = this.bounds[order].xmax - this.bounds[order].xmin;
        var xmid        = (this.bounds[order].xmax + this.bounds[order].xmin) / 2.0;
        var ymid        = (this.bounds[order].ymax + this.bounds[order].ymin) / 2.0;
        var xa = (xdimension - 2.0 * xmargin) / xdiff;
        var ya = (ydimension - 2.0 * ymargin) / ydiff;

        if(xa < ya) { ya = xa; }
        else        { xa = ya; }

        var xb = xdimension / 2.0 - xa * xmid;
        var yb = ydimension / 2.0 - ya * ymid;

        return [ function(x)
                 {
                     // var xa = xa;
                     // var xb = xb;
                     // console.log(xa);
                     // console.log(xb);
                     return x * xa + xb;
                 }
               , function(y)
                 {
                     // var ya = ya;
                     // var yb = yb;
                     return ydimension - (y * ya + yb);
                 }
               ];
    }


    this.compute_bounds = function(order, rotation)
    {
        if(!!this.bounds[order]) { return; }

        this.bounds[order] = { "xmin"   :   0.0
                             , "xmax"   :   0.0
                             , "ymin"   :   0.0
                             , "ymax"   :   0.0
                             , "leaves" :   0
                             };
        var state = { "angles"  :   []
                    , "points"  :   []
                    , "point"   :   { "x" : 0.0
                                    , "y" : 0.0
                                    }
                    , "angle"   :   this.correction + rotation
                    , "count"   :   0
                    , "leaves"  :   0
                    };
        this.bounds_helper( this.axiom
                          , order
                          , order
                          , state
                          );
        this.bounds[order].leaves = state.leaves;
        console.log(state);
        return state.count;
    }

    this.bounds_helper = function(axiom, order, level, state)
    {
        if(level == 1)
        {
            ++state.leaves;
            for(var i = 0; i < axiom.length; ++i)
            {
                switch(axiom[i])
                {
                    case PLUS               :   state.angle += angle;
                                                break;
                    case MINUS              :   state.angle -= angle;
                                                break;
                    case LEFT_CURLY_BRACE   :   state.points.push( { "x" : state.point.x
                                                                   , "y" : state.point.y
                                                                   }
                                                                 );
                                                state.angles.push(state.angle);
                                                break;
                    case RIGHT_CURLY_BRACE  :   state.point = state.points.pop();
                                                state.angle = state.angles.pop();
                                                ++state.count;
                                                break;
                    default                 :   ++state.count;
                                                state.point.x += this.length * Math.cos(state.angle);
                                                state.point.y += this.length * Math.sin(state.angle);
                                                if(state.point.x < this.bounds[order].xmin)
                                                    { this.bounds[order].xmin = state.point.x; }
                                                else if(state.point.x > this.bounds[order].xmax)
                                                    { this.bounds[order].xmax = state.point.x; }
                                                if(state.point.y < this.bounds[order].ymin)
                                                    { this.bounds[order].ymin = state.point.y; }
                                                else if(state.point.y > this.bounds[order].ymax)
                                                    { this.bounds[order].ymax = state.point.y; }
                                                break;
                }
            }
        }
        else
        {
            for(var i = 0; i < axiom.length; ++i)
            {
                switch(axiom[i])
                {
                    case PLUS               :   state.angle += angle;
                                                break;
                    case MINUS              :   state.angle -= angle;
                                                break;
                    case LEFT_CURLY_BRACE   :   state.points.push( { "x" : state.point.x
                                                                   , "y" : state.point.y
                                                                   }
                                                                 );
                                                state.angles.push(state.angle);
                                                break;
                    case RIGHT_CURLY_BRACE  :   state.point = state.points.pop();
                                                state.angle = state.angles.pop();
                                                ++state.count;
                                                break;
                    default                 :   this.bounds_helper( this.productions[axiom[i]]
                                                                  , order
                                                                  , level - 1
                                                                  , state
                                                                  );
                                                break;
                }
            }
        }
    }

    this.render = function(order, xscale, yscale, context, rotation, leaves)
    {
        var gradient = d3.scale.linear()
                         .domain([0, 1/6, 2/6, 1/2, 2/3, 5/6, 1])
                         // .range(["white", "black"]);
                         .range(["red","orange", "yellow", "green", "blue", "indigo", "violet"]);
        // rainbowGradient = context.createLinearGradient(0, 0, canvas.width, 0);
        // rainbowGradient.addColorStop(0, 'red');
        // rainbowGradient.addColorStop(1 / 6, 'orange');
        // rainbowGradient.addColorStop(2 / 6, 'yellow');
        // rainbowGradient.addColorStop(3 / 6, 'green')
        // rainbowGradient.addColorStop(4 / 6, 'blue');
        // rainbowGradient.addColorStop(5 / 6, 'Indigo');
        // rainbowGradient.addColorStop(1, 'Violet');

        var state = { "angles"  :   []
                    , "points"  :   []
                    , "point"   :   { "x" : 0.0
                                    , "y" : 0.0
                                    }
                    , "angle"   :   this.correction + rotation
                    , "leaves"  :   leaves
                    , "leaf"    :   0
                    , "gradient":   gradient
                    };
        console.log(gradient(0.0));
        console.log(gradient(1.0));
        context.strokeStyle = "#FFFF000";
        context.beginPath();
        context.moveTo( xscale(state.point.x)
                      , yscale(state.point.y)
                      );

        this.render_helper( this.axiom
                          , order
                          , order
                          , xscale
                          , yscale
                          , state
                          , context
                          );
        context.closePath();
    }

    this.render_helper = function(axiom, order, level, xscale, yscale, state, context)
    {
        if(level == 1)
        {
            context.strokeStyle = state.gradient(state.leaf / (state.leaves - 1));
            context.beginPath();
            context.moveTo( xscale(state.point.x)
                          , yscale(state.point.y)
                          );
            // console.log(state.leaf / (state.leaves - 1));
            for(var i = 0; i < axiom.length; ++i)
            {
                switch(axiom[i])
                {
                    case PLUS               :   state.angle += angle;
                                                break;
                    case MINUS              :   state.angle -= angle;
                                                break;
                    case LEFT_CURLY_BRACE   :   state.points.push( { "x" : state.point.x
                                                                   , "y" : state.point.y
                                                                   }
                                                                 );
                                                state.angles.push(state.angle);
                                                break;
                    case RIGHT_CURLY_BRACE  :   state.point = state.points.pop();
                                                state.angle = state.angles.pop();
                                                context.moveTo( xscale(state.point.x)
                                                              , yscale(state.point.y)
                                                              );
                                                break;
                    default                 :   state.point.x += this.length * Math.cos(state.angle);
                                                state.point.y += this.length * Math.sin(state.angle);
                                                context.lineTo( xscale(state.point.x)
                                                              , yscale(state.point.y)
                                                              );
                                                //context.stroke();
                                                break;
                }
            }
            context.stroke();
            ++state.leaf;
        }
        else
        {
            for(var i = 0; i < axiom.length; ++i)
            {
                switch(axiom[i])
                {
                    case PLUS               :   state.angle += angle;
                                                break;
                    case MINUS              :   state.angle -= angle;
                                                break;
                    case LEFT_CURLY_BRACE   :   state.points.push( { "x" : state.point.x
                                                                   , "y" : state.point.y
                                                                   }
                                                                 );
                                                state.angles.push(state.angle);
                                                break;
                    case RIGHT_CURLY_BRACE  :   state.point = state.points.pop();
                                                state.angle = state.angles.pop();
                                                // context.moveTo( xscale(state.point.x)
                                                //               , yscale(state.point.y)
                                                //               );
                                                break;
                    default                 :   this.render_helper( this.productions[axiom[i]]
                                                                  , order
                                                                  , level - 1
                                                                  , xscale
                                                                  , yscale
                                                                  , state
                                                                  , context
                                                                  );
                                                break;
                }
            }
        }
    }

    this.draw = function(order, width, height, margin, id, rotation)
    {
        var canvas = document.getElementById(id)
        var context = canvas.getContext('2d');

        var xdimension = width;
        var ydimension = height;
        var xmargin    = margin;
        var ymargin    = margin;
        var table_log   = [];
        var x, y;
        var scales;
        var rotation = rotation || 0.0;
        console.log("Rendering " + this.name + " of order " + order + ".");
        x = performance.now();
        var count = this.compute_bounds(order, rotation);
        y = performance.now();
        table_log.push(["Bounding Rectangle", y - x]);
            // console.warn("Computed Bounds in " + (y1 - x1) + " milliseconds.");


        x = performance.now();
        scales = this.compute_scales( order
                                , xdimension
                                , ydimension
                                , xmargin
                                , ymargin
                                );
        y = performance.now();
        table_log.push(["Scaling Factors", y - x]);
        // console.log("Computed Transformation Factors in " + (y - x) + " milliseconds.");

        x = performance.now();
        this.render(order, scales[0], scales[1], context, rotation, this.bounds[order].leaves);
        y = performance.now();
        table_log.push(["Canvas Rendering", y - x]);
        // console.log("Rendered in " + (y - x) + " milliseconds.");

        if(!console.table)
        {
            console.log(table_log);
        }
        else
        {
            console.table(table_log);
        }
        console.info(count);
        // console.info("Click this URL to open the image : " + canvas.toDataURL());
        // var image = new Image();
        // image.src = canvas.toDataURL("image/png");
        // console.log(image);
        // canvas.parentNode.removeChild(canvas);
        // document.getElementsByTagName("body")[0].appendChild(
        //     document.createElement("img").appendChild(image));
        // window.open(canvas.toDataURL());
        // var data = canvas.toDataURL();
        // data = data.replace("image/png", "image/octet-stream");
        // canvas.parentNode.removeChild(canvas);
        // document.location.href = data;
        // var element = document.getElementById("canvas-image");
        // element.setAttribute("href", canvas.toDataURL());
    }


}
