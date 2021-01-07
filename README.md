# Installation:

run `sh bootstrap.sh`

# Description
This package aims to be a collection of javascript utility functions.

Goals:
- Simple to use, simple to maintain
- piping, currying and partial applications of functions


# Usage

All functions in this package are overloaded and return curried versions of
themselves if not all input parameters are passed at once.

Example:
The map function
```js
  [1,2,3].map((el, i)=>{ return el + i }) // [1, 3, 5]

  // is equivalent to:
  import {map} from 'n42-js-utils';
  map([1, 2, 3], (el, i)=>{ return el + i });  // [1, 3, 5]

  // and can be rewritten as:
  import {map} from 'n42-js-utils';
  map((el, i)=>{ return el + i })([1, 2, 3]);  // [1, 3, 5]

  // or even as:

  import {map} from 'n42-js-utils';
  const mapper = map((el, i)=>{ return el + i })
  mapper([1, 2, 3]) // [1, 3, 5]
```

## Pipe
The beating heart of this library is the `pipe` function. This functions allows
for multiple operations being queued together in one neat pipeline.

Example:
```js
  import {pipe, map} from 'n42-js-utils';
  const data = [1,2,3]
  pipe(
    data,
    map((el)=>{return el + 1;}),
    map((el)=>{return el * 2;}),
  )
```

or as:
```js
import {pipe, map} from 'n42-js-utils';
const data = [1,2,3]
const mapper1 = map((el)=>{return el + 1;})
const mapper2 = map((el)=>{return el * 2;})
pipe(
  data,
  mapper1,
  mapper2
)
```

pipelines can even be extracted:
```js
import {pipeline, pipe, map} from 'n42-js-utils';

const data = [1,2,3]
const transformPipeline = pipeline(
  map((el)=>{return el + 1;}),
  map((el)=>{return el * 2;})
)

pipe(
  data,
  transformPipeline
)
```

## Complex example:

```js
  import {pipe, pipeline, reject, map, eq, lte, keyMap, replace} from 'n42-js-utils'
  import insertIntoDB from '...'

  const data = [
    {id: "1", quantity: 20,   comment: "Hello",         otherData: "1"},
    {id: "2", quantity: 42,   comment: "World",         otherData: "junk"},
    {id: "3", quantity:  0,   comment: null,            otherData: "hallo"},
    {id: "4", quantity: 12,   comment: "",              otherData: ""},
    {id: "5", quantity:  4,   comment: "<no-comment>",  otherData: ""},
    {id: "6", quantity: null, comment: "",              otherData: null},
  ]

  pipe(
    data

    // extract relevant data
    map(({ id, quantity, comment }) => {
      return { id, quantity, comment };
    }),

    // filter out "empty" quntity items
    reject(pipeline(keyMap('quantity'), eq(null))),
    reject(pipeline(keyMap('quantity'), lte(0))),

    // sanitize comments
    map((item)=>{
      item.comment = replace(item.comment || "", /[^a-z0-9-_]/gu, '_')
      return item;
    }),

    map(insertIntoDB)
  )

```


# Methods:

## Filter:
filter can be used to reject elements from array-like structures

```js
  import {filter, pipe} from 'n42-js-utils';
  const data = [{a: true}, {a: true}, {a: false}];

  const filterFunction = ({a})=>{return a === 42}
  const myFilter = filter(filterFunction)
  // returns: (data) => {return filter(data, filterFunction)}

  // default use
  const my_a1 = filter(data, filterFunction)
  // using partial application
  const my_a2 = filter(filterFunction)(data)
  // using partial application
  const my_a3 = myFilter(data)
  // using pipe:
  const my_a4 = pipe(data, filter(filterFunction))
  // my_a1 === my_a2 === my_a3 === my_a4 === [{a: true}, {a: true}]
```

## Map:
map can be used to transform elements in array-like structures

```js
  import {map, pipe} from 'n42-js-utils';
  const data = [{a: 1}, {a: 2}];

  const mapFunction = ({a})=>{return {a: a * 2}}
  const myMap = map(mapFunction)
  // returns: (data) => {return map(data, mapFunction)}

  // default use
  const my_a1 = map(data, mapFunction)
  // partial application
  const my_a2 = map(mapFunction)(data)
  // partial application of tranform function
  const my_a3 = myMap(data)
  // using pipe:
  const my_a4 = pipe(data, map(mapFunction))
  // my_a1 === my_a2 === my_a3 === my_a4 === [{a: 2}, {a: 4}]
```



# Build:

run `yarn build`


# Test:

run `yarn test.js`
(this tests dist/main.js, so you need to run build command before)
