import { assertEquals } from "@std/assert";

const example = `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
`

// read lines
const parse = (input: string): number[][] =>
  input.trim().split(/\r?\n/).map(line => line.trim().split(/\s+/).map(Number))

const increasing = (a: number, b: number): boolean => b - a >= 1 && b - a <= 3
const decreasing = (a: number, b: number): boolean => increasing(b, a)

assertEquals(increasing(1, 2), true)
assertEquals(increasing(1, 1), false)
assertEquals(increasing(1, 5), false)
assertEquals(decreasing(5, 1), false)
assertEquals(decreasing(1, 1), false)
assertEquals(decreasing(3, 1), true)



function all(predicate, [first, second, ...tail]: number[]): boolean {
  let current = predicate(first, second)

  if (tail.length == 0) {
    return current
  } else {
    return current && all(predicate, [second, ...tail])
  }
}

assertEquals(all(increasing, [1, 3, 5, 8]), true)
assertEquals(all(increasing, [1, 3, 2, 8]), false)

const safe = (levels: number[]): boolean => all(increasing, levels) || all(decreasing, levels)

const countSafe = (input: string): number => parse(input).filter(safe).length

assertEquals(countSafe(example), 2)


const input = await Deno.readTextFile('day2.txt');
console.log(countSafe(input));

// part 2
const withoutIndex = (_, i, all) => all.toSpliced(i, 1)

assertEquals(withoutIndex(2, 2, [0,1,2,3,4,5]), [0,1,3,4,5])

const almostSafe = (levels: number[]): boolean => levels.map(withoutIndex).some(safe)

const countAlmostSafe = (input: string): number => parse(input).filter(almostSafe).length

console.log(countAlmostSafe(input));

