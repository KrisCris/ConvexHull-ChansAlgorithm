// import Vertex from "./Vertex.js";
const Vertex = require('./Vertex')
class Chans {
    #P;
    #subP = [];
    #subCH = [];

    constructor(P){
        this.#P = P
    }

    Hull(P) {
        for (let t = 0; true; t++) {
            let m = Math.min(Math.pow(2,Math.pow(2,t)), P.length)
            let L = this.PartialHull(P, m)
            if(L != false){
                return L
            }
        }
    }

    PartialHull(m) {
        let r = Math.ceil(this.#P.length/m)

        // Divide P into P1, P2, ... Pr
        this.#subP = []
        for(let i = 0; i < r; i++){
            this.#subP.push(this.#P.slice(m*i, m*(i+1)))
        }

        // Compute CH for each Pi
        for(let p of this.#subP){
            this.#subCH.push(this.GrahamScan(p))
        }

        // JarvisMarch






    }




    GrahamScan(P) {
        let xSorted = P.sort(Vertex.xSort);

        // Compute the lower hull
        let chLower = [xSorted[0], xSorted[1]]
        for (let i = 2; i < xSorted.length; i++) {
            while (chLower.length >= 2 && Vertex.orient(chLower[chLower.length - 2], chLower[chLower.length - 1], xSorted[i]) < 0) {
                chLower.pop()
            }
            chLower.push(xSorted[i])
        }

        // Compute the upper hull
        let chUpper = [xSorted[xSorted.length - 1], xSorted[xSorted.length - 2]]
        for (let i = xSorted.length - 3; i >= 0; i--) {
            while (chUpper.length >= 2 && Vertex.orient(chUpper[chUpper.length - 2], chUpper[chUpper.length - 1], xSorted[i]) < 0) {
                chUpper.pop()
            }
            chUpper.push(xSorted[i])
        }

        // Merge 2 hulls
        chLower.pop()
        chUpper.pop()

        return chLower.concat(chUpper)
    }

    JarvisMarch() {

    }
}

// your code here
let P = [new Vertex(1,3), new Vertex(2,6), new Vertex(-1,4), new Vertex(-9, 2), new Vertex(-6, -2), new Vertex(5,-3)]
let chans = new Chans(P)
// let result = chans.Hull()
let result = chans.GrahamScan(P)
for(let p of result){
    console.log(p.xPos, p.yPos)
}