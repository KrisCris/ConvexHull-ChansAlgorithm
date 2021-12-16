import Vertex from "./Vertex.js";
import Edge from './Edge.js'
export default class Chans {
    P;
    steps = []
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
            inst.P = P;
            inst.subP = [];
            inst.subCH = [];
            return inst;
        }
    }

    Hull() {
        this.steps = [];
        for (let t = 1; true; t++) {
            this.steps.push({
                m: 0,
                r: 0,
                subP: [],
                pLen: this.P.length,
                subCH: [],
                edgeLen: 0,
                JM: {
                    mEdges: [],
                    mVertices: [],
                    mScans: []
                },
                isCompleted: false
            });

            let m = Math.min(Math.pow(2, Math.pow(2, t)), this.P.length)
            // update step.m
            this.steps[this.steps.length - 1].m = m

            let L = this.PartialHull(m)
            if (L != null) {
                return this.steps
            }
        }
    }

    mHull(m) {
        this.steps = [];
        this.steps.push({
            m: 0,
            r: 0,
            subP: [],
            pLen: this.P.length,
            subCH: [],
            edgeLen: 0,
            JM: {
                mEdges: [],
                mVertices: [],
                mScans: []
            },
            isCompleted: false
        });
        // update step.m
        this.steps[this.steps.length - 1].m = m

        
        let L = this.PartialHull(m)
        return this.steps
    }

    PartialHull(m) {
        let r = Math.ceil(this.P.length / m)
        // update step.r
        this.steps[this.steps.length - 1].r = r

        // Divide P into P1, P2, ... Pr
        let subP = []
        for (let i = 0; i < r; i++) {
            subP.push(this.P.slice(m * i, m * (i + 1)))
        }
        // update step.subP
        this.steps[this.steps.length - 1].subP = subP

        let subCH = []
        // Compute CH for each Pi
        for (let p of subP) {
            let ret = this.GrahamScan(p)
            subCH.push(ret)
            // update step.edgeLen
            this.steps[this.steps.length - 1].edgeLen += ret.edges.length
        }
        // update step.subCH
        this.steps[this.steps.length - 1].subCH = subCH

        // "JarvisMarch"
        let ret = this.JarvisMarch(subCH, r, m)
        return ret == null ? null : ret
    }

    GrahamScan(P) {
        if (P.length < 2) {
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
    JarvisMarch(subCH, r, m) {
        let eachMaxAngleV = []
        // get lowest point p1
        let p1 = this.P[0]
        for (let d of this.P) {
            if (d.yPos < p1.yPos) {
                p1 = d
            }
        }

        let pk = [new Vertex(Number.MIN_SAFE_INTEGER, 0), p1]
        for (let k = 1; k <= m; k++) {
            eachMaxAngleV.push([])
            for (let i = 0; i < r; i++) {
                let l = [...subCH[i].vertices]
                let idx = l.indexOf(pk[k - 1])
                if (idx > -1) {
                    l.splice(idx, 1);
                }
                idx = l.indexOf(pk[k])
                if (idx > -1) {
                    l.splice(idx, 1);
                }
                if (l.length < 1) continue
                eachMaxAngleV[k - 1].push(this.bSearch(l, 0, l.length - 1, pk[k - 1], pk[k]))
            }
            let angle = Number.MIN_SAFE_INTEGER
            pk.push(eachMaxAngleV[k - 1][0])
            for (let d of eachMaxAngleV[k - 1]) {
                if (Vertex.degree(pk[k - 1], pk[k], d) > angle) {
                    angle = Vertex.degree(pk[k - 1], pk[k], d)
                    pk[k + 1] = d
                }
            }
            if (pk[k + 1] === pk[1]) {
                let vertices = pk.slice(1, pk.length);

                // update step.JM.mScans
                this.steps[this.steps.length - 1].JM.mScans = eachMaxAngleV;
                // update step.JM.mVertices
                this.steps[this.steps.length - 1].JM.mVertices = vertices;
                // update step.JM.mEdges
                let edges = [];
                for (let i = 1; i < pk.length; i++) {
                    edges.push(new Edge(vertices[i - 1], vertices[i]));
                }
                this.steps[this.steps.length - 1].JM.mEdges = edges;
                // update step.isCompleted
                this.steps[this.steps.length - 1].isCompleted = true;

                return vertices;
            }
        }

        // update step.JM.mScans
        this.steps[this.steps.length - 1].JM.mScans = eachMaxAngleV;
        // update step.JM.mVertices
        let vertices = pk.slice(1, pk.length);
        this.steps[this.steps.length - 1].JM.mVertices = vertices;
        // update step.JM.mEdges
        let edges = [];
        for (let i = 1; i < pk.length; i++) {
            edges.push(new Edge(vertices[i - 1], vertices[i]));
        }
        this.steps[this.steps.length - 1].JM.mEdges = edges;

        return null;
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
            // update step.subCH
            this.steps[this.steps.length - 1].JM.mScans
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

    lSearch(P, a, b) {
        let max = undefined
        let maxAngle = Number.MIN_SAFE_INTEGER
        for (let v of P) {
            if (Vertex.degree(a, b, v) >= maxAngle) {
                maxAngle = Vertex.degree(a, b, v)
                max = v
            }
        }
        return max
    }
}


