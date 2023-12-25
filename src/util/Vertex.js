export default class Vertex {
    static DefaultColor = "#74ff99";
    static DefaultR = 5;
    static MaxR = 6;

    xPos;
    yPos;
    predecessor;
    color;

    constructor(xPos, yPos, color=Vertex.DefaultColor) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.color = color
    }

    getR() {
        if (this.color == Vertex.DefaultColor) {
            return Vertex.DefaultR;
        }
        return Vertex.MaxR;
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
        return (p.xPos * q.yPos + q.xPos * r.yPos + r.xPos * p.yPos) - (p.xPos * r.yPos + q.xPos * p.yPos + r.xPos * q.yPos)
    }

    static degree(p, q, r) {
        let a = [p.xPos - q.xPos, p.yPos - q.yPos]
        let b = [r.xPos - q.xPos, r.yPos - q.yPos]
        let cos = (a[0] * b[0] + a[1] * b[1]) / (Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2)) * Math.sqrt(Math.pow(b[0], 2) + Math.pow(b[1], 2)))
        return Math.acos(cos)
    }
}