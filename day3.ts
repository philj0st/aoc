import { assertEquals } from "@std/assert";

const example =
`xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`

const regex = /mul\(([1-9][0-9]{0,2}),([1-9][0-9]{0,2})\)/gm

const sumOfMuls = (input: string): number => input.matchAll(regex).reduce((acc, cur) => acc + cur[1] * cur[2], 0)

assertEquals(sumOfMuls(example), 161)

const input = await Deno.readTextFile('day3.txt');
console.log(sumOfMuls(input));

// part 2

const doo = `do()`
const dont = `don't()`

const example2 = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`
const re = /mul\([1-9][0-9]{0,2},[1-9][0-9]{0,2}\)|do\(\)|don\'t\(\)/g

const firstOp = example2.match(re)!![0].matchAll(regex).next().value

assertEquals(firstOp[1], "2")
assertEquals(firstOp[2], "4")

var doit = true
var sum = 0
for (const op of input.matchAll(re)) {
  switch (op[0]) {
    case doo:
      doit = true
      break;

    case dont:
      doit = false
      break;

    default:
      if (doit) {
        const mul = op[0].matchAll(regex).next().value
        sum += mul[1] * mul[2] 
      }
      break;
  }
}

console.log(sum);



