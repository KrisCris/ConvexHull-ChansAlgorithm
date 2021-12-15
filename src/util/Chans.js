import Vertex from "./Vertex.js";
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

        // Merge 2 hulls
        chLower.pop()
        chUpper.pop()

        return chLower.concat(chUpper)
    }

    JarvisMarch() {

    }
}