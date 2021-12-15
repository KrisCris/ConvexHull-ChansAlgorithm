export default class Edge {
    begin;
    end;

    constructor(begin, end) {
        this.begin = begin;
        this.end = end;
    }

    get x0() {
        return this.begin.xPos
    }

    get y0() {
        return this.begin.yPos
    }

    get x1() {
        return this.end.xPos
    }

    get y1() {
        return this.end.yPos
    }
}