
class Complex {
    constructor(real, imag) {
        this.real = real;
        this.imag = imag;
        this.magnitude = Math.sqrt(real*real + imag*imag);
    }

    mul(c) {
        return new Complex(this.real*c.real + this.real*c.imag, this.imag*c.real + this.imag*c.imag);
    }
}

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

let colors = [
    [255, 0, 0],
    [255, 255, 0]
]

function lerp(a, b, x) {
    return a + (b - a) * x
}


ctx.lineWidth = "1";
for( let x = lX; x <= rX; x += iX ) {
    for( let y = lY; y <= rY; y += iY ) {
        let c = new Complex(x, y);
        let z = new Complex(0, 0);
        let i = 0;
        while( c.magnitude < 2 && i < iters ) {
            c = c.mul(c);
            i += 1;
        }
        i = colors.length / i;
        let lower = Math.floor(i);
        let higher = Math.ceil(i);
        if (lower < 0) {lower = colors.length - 1;}
        if (higher >= colors.length) {higher = 0;}
        let diff = i - lower;

        let col = [lerp(lower[1], higher[1], diff), lerp(lower[2], higher[2], diff), lerp(lower[3], higher[3], diff)];
        ctx.beginPath();
        ctx.strokeStyle = "rgb(" + toString(col[1]) + ", " + toString(col[2]) + ", " + toString(col[3]) + ")";
        ctx.rect((x + dX / 2) / 2 * screenSize.X, (y + dY / 2) / 2 * screenSize.Y , 1, 1);
        ctx.stroke();
    }
}
