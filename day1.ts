import { zip, unzip, sumOf } from "@std/collections";
import { countBy } from "@es-toolkit/es-toolkit";
import { assertEquals } from "@std/assert";

const example = `
3   4
4   3
2   5
1   3
3   9
3   3
`

// returns the two columns as lists
const parse = (input: string): number[][] => 
  input.trim().split(/\r?\n/).map(line => line.trim().split(/\s+/).map(Number))

assertEquals(parse(`
1   2
3   4
`), [[1,2],[3,4]])
   
assertEquals(unzip(parse(`
1   2
3   4
`)), [[1,3],[2,4]])

const distance = ([left, right]: number[]): Number => Math.abs(left - right)

assertEquals(distance([1,5]), 4)
assertEquals(distance([5,1]), 4)

const sortedCols = (tuples) => zip(...unzip(tuples).map(list => list.sort((a, b) => a - b)))

assertEquals(sortedCols([
  [3, 4],
  [1, 2]
]),[
    [1, 2],
    [3, 4]])

assertEquals(
  sumOf(sortedCols(parse(example)), distance)
  , 11)

const distanceSum = (input: string) => sumOf(sortedCols(parse(input)), distance)

const input = await Deno.readTextFile('day1.txt');

console.log(distanceSum(input));

// part 2
function similarityScore(input: string) {
  const [left, right] = unzip(parse(input))
  const occurences = countBy(right, it => it)
  return sumOf(left, (it) => it * occurences[it] || 0)
} 

assertEquals(
  similarityScore(example),
  31
)

console.log(similarityScore(input));

