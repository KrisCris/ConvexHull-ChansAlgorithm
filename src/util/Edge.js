export default class Edge {
    begin;
    end;
    color;

    constructor(begin, end, color="#74ff99") {
        this.begin = begin;
        this.end = end;
        this.color = color
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