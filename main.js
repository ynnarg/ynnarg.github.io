print("Started ...");
import complex from "/complex.js";

let canvas = document.getElementById("Canvas");
let ctx = canvas.getContext("2d");

let screenSize = {"X":800, "Y":800};

let iters = 10;

let lX = -1;
let rX = 1;
let lY = -1;
let rY = 1;

let dX = Math.abs(lX - rX);
let dY = Math.abs(lY - rY);

let iX = dX / screenSize.X;
let iY = dY / screenSize.Y;

for( let x = lX; x <= rX; x += iX ) {
    for( let y = lY; y <= rY; y += iY ) {
        let c = new complex(x, y);
        let z = new complex(0, 0);
        let i = 0;
        while( c.magnitude < 2 && i < iters ) {
            c = c.mult(c);
        }
    }
}
