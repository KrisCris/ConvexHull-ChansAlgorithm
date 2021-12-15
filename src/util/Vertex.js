export default class Vertex {
    xPos;
    yPos;
    predecessor;

    constructor(xPos, yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
    }

    static xSort(v1, v2) {
        if (v1.xPos > v2.xPos) return 1;
        else if (v1.xPos < v2.xPos) return -1;
        else return 0;
    }

    static ySort(v1, v2) {
        if (v1.yPos > v2.yPos) return 1;
        else if (v1.yPos < v2.yPos) return -1;
        else return 0;
    }

    static orient(p, q, r) {
        return (p.xPos*q.yPos+q.xPos*r.yPos+r.xPos*p.yPos) - (p.xPos*r.yPos+q.xPos*p.yPos+r.xPos*q.yPos)
    }

    // orient(v) {
    //     return (this.#xPos * this.#predecessor.yPos + v.xPos * this.#yPos + v.yPos * this.#predecessor.xPos) -
    //         (v.yPos * this.#xPos + this.#yPos * this.#predecessor.xPos + v.xPos * this.#predecessor.yPos)
    // }
}

// module.exports.Vertex = Vertex;