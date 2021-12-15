import Vertex from "./Vertex.js";
import Edge from './Edge.js'
export default class Chans {

    static GrahamScan(vertices) {
        let xSorted = vertices.sort(Vertex.xSort);

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

    JarvisMarch() {

    }
}