import Vertex from "./Vertex.js";
import Edge from './Edge.js'
export default class ChansStep {
    k;
    m;
    P;
    subP = [];
    subCH = [];
    eachMaxAngleV = [];
    pk = []
    static instance;

    constructor(P) {
        this.P = P
        this.k = 0
    }

    static getInstance(P) {
        if (P.length < 3) return undefined;
        if (ChansStep.instance === undefined) {
            ChansStep.instance = new ChansStep(P);
            return ChansStep.instance;
        } else {
            let inst = ChansStep.instance
            inst.P = P
            inst.subP = []
            inst.subCH = []
            return inst;
        }
    }

    Hull() {
        for (let t = 1; true; t++) {
            let m = Math.min(Math.pow(2, Math.pow(2, t)), this.P.length)
            let L = this.PartialHull(m)
            if (L != null) {
                let edges = []
                for (let i = 1; i < L.length; i++) {
                    edges.push(new Edge(L[i - 1], L[i]))
                }
                return { vertices: L, edges: edges, subCH: this.subCH, subP:this.subP, r: Math.ceil(this.P.length / m)}
            }
        }
    }

    //step 1: divide the point set into subsets of no more than m points in each
    mChansDiv1() {
        let r = Math.ceil(this.P.length / this.m)

        // Divide P into P1, P2, ... Pr
        this.subP = []
        for (let i = 0; i < r; i++) {
            this.subP.push(this.P.slice(this.m * i, this.m * (i + 1)))
        }
        return this.subP
    }
    // step 2: build partial hull, same as the function PartialHull()
    mChansPH2() {
        this.subCH = []
        // Compute CH for each Pi
        for (let p of this.subP) {
            this.subCH.push(this.GrahamScan(p))
        }

        // "JarvisMarch"
        let ret = this.JarvisMarch(r, this.m)
        return ret == null ? null : ret 
    }
    // step 3: find the biggest angle's vertex by binary search
    // i is the i-th subhull
    // this.k is the k-th point in the output hull
    mChansFindV3(i) {
        // get lowest point p1
        let r = Math.ceil(this.P.length / this.m);
        if(this.k == 0) {
            let p1 = this.P[0];
            
            for(let d of this.P){
                if (d.yPos < p1.yPos){
                    p1 = d
                }
            }
            let pk = [new Vertex(Number.MIN_SAFE_INTEGER, 0), p1]
        }
        this.eachMaxAngleV.push([])
        for (let i = 0; i < r; i++) {
            let l = [...this.subCH[i].vertices]
            // delete the vertex itself if it is the same as pk[this.k - 1] or pk[this.k]
            let idx = l.indexOf(pk[this.k - 1])
            if (idx > -1) {
                l.splice(idx, 1);
            }
            idx = l.indexOf(pk[this.k])
            if (idx > -1) {
                l.splice(idx, 1);
            }
            if(l.length<1) continue
            this.eachMaxAngleV[this.k - 1].push(this.bSearch(l, 0, l.length - 1, pk[this.k - 1], pk[this.k]))
        }
        let angle = Number.MIN_SAFE_INTEGER
        pk.push(this.eachMaxAngleV[this.k - 1][0])
        for (let d of this.eachMaxAngleV[this.k - 1]) {
            if (Vertex.degree(pk[this.k - 1], pk[this.k], d) > angle) {
                angle = Vertex.degree(pk[this.k - 1], pk[this.k], d)
                pk[this.k + 1] = d
            }
        }
        this.k += 1;
        if (pk != null) {
            let edges = []
            for (let i = 1; i < pk.length; i++) {
                edges.push(new Edge(pk[i - 1], pk[i]))
            }
            return { vertices: pk, edges: edges, subCH: this.subCH, subP:this.subP}
        }


    }
    mChans(){
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

        this.eachMaxAngleV = []
        // get lowest point p1
        let p1 = this.P[0]
        for(let d of this.P){
            if (d.yPos < p1.yPos){
                p1 = d
            }
        }
        let pk = [new Vertex(Number.MIN_SAFE_INTEGER, 0), p1]
        for (let k = 1; k <= m; k++) {
            this.eachMaxAngleV.push([])
            for (let i = 0; i < r; i++) {
                let l = [...this.subCH[i].vertices]
                let idx = l.indexOf(pk[k - 1])
                if (idx > -1) {
                    l.splice(idx, 1);
                }
                idx = l.indexOf(pk[k])
                if (idx > -1) {
                    l.splice(idx, 1);
                }
                if(l.length<1) continue
                this.eachMaxAngleV[k - 1].push(this.bSearch(l, 0, l.length - 1, pk[k - 1], pk[k]))
                // this.eachMaxAngleV[k - 1].push(this.bSearch(this.subCH[i].vertices, 0, this.subCH[i].vertices.length - 1, pk[k - 1], pk[k]))
                // this.eachMaxAngleV[k - 1].push(this.lSearch(l, pk[k - 1], pk[k]))


            }
            // console.log(this.eachMaxAngleV[k - 1])
            let angle = Number.MIN_SAFE_INTEGER
            pk.push(this.eachMaxAngleV[k - 1][0])
            for (let d of this.eachMaxAngleV[k - 1]) {
                if (Vertex.degree(pk[k - 1], pk[k], d) > angle) {
                    angle = Vertex.degree(pk[k - 1], pk[k], d)
                    pk[k + 1] = d
                }
            }
            if (pk[k + 1] === pk[1]) {
                pk = pk.slice(1, pk.length)
                break
            }
        }

        if (pk != null) {
            let edges = []
            for (let i = 1; i < pk.length; i++) {
                edges.push(new Edge(pk[i - 1], pk[i]))
            }
            return { vertices: pk, edges: edges, subCH: this.subCH, subP:this.subP}
        }
    }

    testPartialGH(m){
        let r = Math.ceil(this.P.length / m)
        this.subP = []
        for (let i = 0; i < r; i++) {
            this.subP.push(this.P.slice(m * i, m * (i + 1)))
        }

        for (let p of this.subP) {
            this.subCH.push(this.GrahamScan(p))
        }

        return [this.subP, this.subCH]
    }

    PartialHull(m) {
        let r = Math.ceil(this.P.length / m)

        // Divide P into P1, P2, ... Pr
        this.subP = []
        for (let i = 0; i < r; i++) {
            this.subP.push(this.P.slice(m * i, m * (i + 1)))
        }
        this.subCH = []
        // Compute CH for each Pi
        for (let p of this.subP) {
            this.subCH.push(this.GrahamScan(p))
        }

        // "JarvisMarch"
        let ret = this.JarvisMarch(r, m)
        return ret == null ? null : ret
    }

    GrahamScan(P) {
        if(P.length < 2){
            return { vertices: [P[0]], edges: [new Edge(P[0], P[0])] }
        }
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

    // m: max size of each vertice list
    // r: number of lists
    JarvisMarch(r, m) {
        this.eachMaxAngleV = []
        // get lowest point p1
        let p1 = this.P[0]
        for(let d of this.P){
            if (d.yPos < p1.yPos){
                p1 = d
            }
        }
        let pk = [new Vertex(Number.MIN_SAFE_INTEGER, 0), p1]
        for (let k = 1; k <= m; k++) {
            this.eachMaxAngleV.push([])
            for (let i = 0; i < r; i++) {
                let l = [...this.subCH[i].vertices]
                let idx = l.indexOf(pk[k - 1])
                if (idx > -1) {
                    l.splice(idx, 1);
                }
                idx = l.indexOf(pk[k])
                if (idx > -1) {
                    l.splice(idx, 1);
                }
                if(l.length<1) continue
                this.eachMaxAngleV[k - 1].push(this.bSearch(l, 0, l.length - 1, pk[k - 1], pk[k]))
                // this.eachMaxAngleV[k - 1].push(this.lSearch(l, pk[k - 1], pk[k]))

                // this.eachMaxAngleV[k - 1].push(this.bSearch(this.subCH[i].vertices, 0, this.subCH[i].vertices.length-1, pk[k - 1], pk[k]))
            }
            let angle = Number.MIN_SAFE_INTEGER
            pk.push(this.eachMaxAngleV[k - 1][0])
            for (let d of this.eachMaxAngleV[k - 1]) {
                if (Vertex.degree(pk[k - 1], pk[k], d) > angle) {
                    angle = Vertex.degree(pk[k - 1], pk[k], d)
                    pk[k + 1] = d
                }
            }
            if (pk[k + 1] === pk[1]) {
                return pk.slice(1, pk.length)
            }
        }
        // debug purpose
        return null
    }

    // P: the vertices list
    // i: begin idx of the searching process
    // j: end idx of the searching process
    // a: first vertex of the edge
    // b: second vertex of the edge
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

    lSearch(P, a, b){
        let max = undefined
        let maxAngle = Number.MIN_SAFE_INTEGER
        for(let v of P){
            if(Vertex.degree(a,b,v) >= maxAngle){
                maxAngle = Vertex.degree(a,b,v)
                max = v
            }
        }
        return max
    }


    // to be removed
    test() {
        // let result = ChansStep.Hull()
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


