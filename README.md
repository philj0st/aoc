deno add jsr:@std/collections
deno add jsr:@std/assert
deno repl --eval-file=day1.ts --allow-read


```
.reduce<[number[], number[]]>(([left, right], [a, b]) => [[...left, a], [...right, b]], [[], []]);
```

with https://jsr.io/@std/collections/doc/~/unzip

