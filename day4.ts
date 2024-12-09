import { range } from "@es-toolkit/es-toolkit"
import { assertEquals } from "@std/assert"

const example =
  `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`

const keyword = `XMAS`

const parse = (input: string): string[][] => input.split('\n').map(it => it.split(''))

class Matrix extends Array {
  constructor(...args) {
    super(...args)

    this.dimensions = {
      "x": this[0]?.length || 0,
      "y": this.length
    }
  }

  at(x: number, y: number) {
    return this[y]?.[x]
  }

  dimensions: { x: number, y: number }

  diagDown = (x: number, y: number) => this.walk(x, y, 1, 1)()
  diagUp = (x: number, y: number) => this.walk(x, y, 1, -1)()
  right = (x: number, y: number) => this.walk(x, y, 1, 0)()
  down = (x: number, y: number) => this.walk(x, y, 0, 1)()

  directions = [this.diagUp, this.right, this.diagDown, this.down]

  allCoords = () => range(0, this.dimensions.x)
    .flatMap(x => range(0, this.dimensions.y)
      .map(y => [x, y]))


  private isInBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.dimensions.x && y >= 0 && y < this.dimensions.y
  }

  private walk(startX: number, startY: number, dx: number, dy: number) {
    return function*(this: Matrix) {
      let x = startX
      let y = startY
      while (true) {
        if (!this.isInBounds(x + dx, y + dy)) {
          return this.at(x, y)
        } else {
          yield this.at(x, y)
          x += dx
          y += dy
        }
      }
    }.bind(this)
  }
}


let ex = new Matrix(...parse(example))

function take(n: number, from: Generator<any>) {
  let next = from.next()
  --n
  if (n == 0 || next.done) return [next.value]
  return [next.value].concat(take(n, from))
}

assertEquals(
  new Matrix(...parse(`ABC\nDEF`)).dimensions,
  { "x": 3, "y": 2 }
)

const xmas = take(keyword.length, ex.diagDown(4, 0))
assertEquals(xmas.join(''), "XMAS")

const reversed = keyword.split('').reverse().join('')

const countKeywords = (matrix: Matrix) =>
  range(0, matrix.dimensions.x)
    .flatMap(x => range(0, matrix.dimensions.y)
      .flatMap(y =>
        matrix.directions.flatMap(direction => take(keyword.length, direction(x, y)).join(''))
      ))
    .filter(word => word === keyword || word === reversed)

const input = await Deno.readTextFile('day4.txt')
const inputMatrix = new Matrix(...parse(input))
console.log(countKeywords(inputMatrix).length)

// part two
// 
// X0X
// 0X0
// X0X

const crossAt = (x: number, y: number) =>
  take(3, inputMatrix.diagDown(x, y))
    .concat(take(3, inputMatrix.diagUp(x, y + 2)))

const keycrosses = [`MASMAS`, `SAMMAS`, `MASSAM`, `SAMSAM`]

const countKeycrosses = inputMatrix.allCoords().map(([x, y]) => crossAt(x, y)).filter(it => keycrosses.includes(it.join(''))).length
console.log(countKeycrosses)

