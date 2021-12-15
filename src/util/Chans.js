import Vertex from "./Vertex.js";
import Edge from './Edge.js'
export default class Chans {
    P;
    subP = [];
    subCH = [];
    static instance;

    constructor(P) {
        this.P = P
    }

    static getInstance(P) {
        if (P.length < 3) return undefined;
        if (Chans.instance === undefined) {
            Chans.instance = new Chans(P);
            return Chans.instance;
        } else {
            let inst = Chans.instance
            inst.P = P
            inst.subP = []
            inst.subCH = []
            return inst;
        }
    }

    Hull(P) {

        for (let t = 0; true; t++) {
            let m = Math.min(Math.pow(2, Math.pow(2, t)), P.length)
            let L = this.PartialHull(P, m)
            return L
            if (L != false) {
            }
        }
    }

    PartialHull(m) {
        let r = Math.ceil(this.P.length / m)
        // Divide P into P1, P2, ... Pr

        this.subP = []
        for (let i = 0; i < r; i++) {
            this.subP.push(this.P.slice(m * i, m * (i + 1)))
        }

        // Compute CH for each Pi
        for (let p of this.subP) {
            this.subCH.push(this.GrahamScan(p))
        }

        // JarvisMarch
    }
    GrahamScan(P) {
        let xSorted = P.sort(Vertex.xSort);

        // Compute the lower hull
        let chLower = [xSorted[0], xSorted[1]]
        for (let i = 2; i < xSorted.length; i++) {
            while (chLower.length >= 2 && Vertex.orient(chLower[chLower.length - 2], chLower[chLower.length - 1], xSorted[i]) <= 0) {
                chLower.pop()
            }
            chLower.push(xSorted[i])
        }

        // Compute the upper hull
        let chUpper = [xSorted[xSorted.length - 1], xSorted[xSorted.length - 2]]
        for (let i = xSorted.length - 3; i >= 0; i--) {
            while (chUpper.length >= 2 && Vertex.orient(chUpper[chUpper.length - 2], chUpper[chUpper.length - 1], xSorted[i]) <= 0) {
                chUpper.pop()
            }
            chUpper.push(xSorted[i])
        }
        // build edges
        let edges = []
        for (let i = 1; i < chLower.length; i++) {
            edges.push(new Edge(chLower[i - 1], chLower[i]))
        }
        for (let i = 1; i < chUpper.length; i++) {
            edges.push(new Edge(chUpper[i - 1], chUpper[i]))
        }
        // Merge 2 hulls (vertices)
        chLower.pop()
        chUpper.pop()

        return { vertices: chLower.concat(chUpper), edges: edges }
    }

    bSearch(P, i, j, a, b) {
        if (i == j)
            return P[i];
        if (Vertex.degree(a, b, P[i]) > Vertex.degree(a, b, P[j])) {
            if (Vertex.degree(a, b, P[Math.floor((i + j) / 2)]) < Vertex.degree(a, b, P[j]))
                return this.bSearch(P, i, Math.floor((i + j) / 2), a, b);
            else if (Vertex.degree(a, b, P[Math.floor((i + j) / 2 + 1)]) > Vertex.degree(a, b, P[Math.floor((i + j) / 2)]))
                return this.bSearch(P, Math.floor((i + j) / 2) + 1, j, a, b);
            else if (Vertex.degree(a, b, P[Math.floor((i + j) / 2 + 1)]) == Vertex.degree(a, b, P[Math.floor((i + j) / 2)]))
                return P[Math.floor((i + j) / 2)];
            else return this.bSearch(P, i, Math.floor((i + j) / 2), a, b);
        }
        else {
            if (Vertex.degree(a, b, P[Math.floor((i + j) / 2)]) < Vertex.degree(a, b, P[j]))
                return this.bSearch(P, Math.floor((i + j) / 2) + 1, j, a, b);
            else if (Vertex.degree(a, b, P[Math.floor((i + j) / 2 + 1)]) > Vertex.degree(a, b, P[Math.floor((i + j) / 2)]))
                return this.bSearch(P, Math.floor((i + j) / 2) + 1, j, a, b);
            else if (Vertex.degree(a, b, P[Math.floor((i + j) / 2 + 1)]) == Vertex.degree(a, b, P[Math.floor((i + j) / 2)]))
                return P[Math.floor((i + j) / 2)];
            else return this.bSearch(P, i, Math.floor((i + j) / 2), a, b);
        }

    };


    JarvisMarch() {

    }

    // to be removed
    test() {
        // let result = chans.Hull()
        let result = this.GrahamScan(this.P).vertices
        // for (let p of result) {
        //     console.log(p.xPos, p.yPos)
        // }
        let a = new Vertex(7, 0);
        let b = new Vertex(7, 9);
        let newRes = this.bSearch(result, 0, 3, a, b);
        return ("The largest angle with line (" + a.xPos + " " + a.yPos + ") (" + b.xPos + " " + b.yPos + ") is made by:" + newRes.xPos + " " + newRes.yPos)
    }
}


