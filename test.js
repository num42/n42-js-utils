import lib from  './src/index.js';



test("allWith", [[], "a", "1"], true)
test("allWith", [[{a: "1"}], "a", "1"], true)
test("allWith", [[{a: "1"}], "b", "1"], false)
test("allWith", [[{a: "2"}], "a", "1"], false)
test("allWith", [[{a: "1"}, {a: "1"}], "a", "1"], true)
test("allWith", [[{a: "1"}, {a: "2"}], "a", "1"], false)




test("trim", ["A"], "A")
test("trim", ["A "], "A")
test("trim", [" A "], "A")
test("trim", ["A"], "A")
test("trim", ["AB"], "AB")
test("trim", ["A "], "A")



test("eq", [null, null], true)
test("eq", ["A", "A"], true)
test("eq", ["A", "B"], false)
test("eq", ["A"], true, (a)=>a("A"))
test("eq", ["B"], false, (a)=>a("A"))


test("exec", ["toUpperCase"], "HELLO WORLD", (a)=>a("hello world"))



test("slice", ["Hello", 0, 1], "H")
test("slice", ["Hello", 0, 2], "He")
test("slice", ["Hello", 0, 3], "Hel")
test("slice", ["Hello", 1, 3], "el")
test("slice", ["Hello", 1, 5], "ello")




test("chunk", [["a"], 0], [["a"]])
test("chunk", [["a"], 1], [["a"]])
test("chunk", [["a"], 2], [["a"]])
test("chunk", [["a", "b"], 0], [["a", "b"]])
test("chunk", [["a", "b"], 1], [["a"], ["b"]])
test("chunk", [["a", "b"], 2], [["a", "b"]])
test("chunk", [["a", "b"], 3], [["a", "b"]])
test("chunk", [["a", "b", "c", "d", "e", "4"], 0], [["a", "b", "c", "d", "e", "4"]])
test("chunk", [["a", "b", "c", "d", "e", "4"], 2], [["a", "b"],["c", "d"], ["e", "4"]])
test("chunk", [["a", "b", "c", "d", "e", "4"], 3], [["a", "b", "c"],["d", "e", "4"]])
test("chunk", [[], 0], [[]])
test("chunk", [[], 1], [[]])
test("chunk", [[], 2], [[]])
test("chunk", [[], 3], [[]])



test("find", [null, ()=>{}], null)
test("find", [[], ()=>{}], null)
test("find", [[], (a)=>{return a === 4}], null)
test("find", [[1], (a)=>{return a === 4}], null)
test("find", [[1, 2], (a)=>{return a === 2}], 2)




test("findBy", [null, null, null], null)
test("findBy", [null, null, 1], null)
test("findBy", [null, "", null], null)
test("findBy", [null, "", 1], null)
test("findBy", [[], null, null], null)
test("findBy", [[], null, 1], null)
test("findBy", [[], "", null], null)
test("findBy", [[], "", 1], null)
test("findBy", [[{a: "1"}], null, null], null)
test("findBy", [[{a: "1"}], null, 1], null)
test("findBy", [[{a: "1"}], "", null], null)
test("findBy", [[{a: "1"}], "", 1], null)
test("findBy", [[{a: "1"}], "a", null], null)
test("findBy", [[{a: "1"}], "a", 1], null)
test("findBy", [[{a: "1"}], "a", "1"], {a: "1"})
test("findBy", [[{a: "1"}, {a: "2"}], "a", "2"], {a: "2"})
test("findBy", [[{a: "1"}, {a: "2"}], "b", null], null)
test("findBy", [[{a: "1"}, {a: "2"}], "b", "2"], null)







// TODO: Add tests for
// [x] allWith
// [ ] all
// [ ] anyWith
// [ ] any
// [ ] append
// [ ] both
// [x] chunk
// [ ] compact
// [ ] conditional
// [ ] createServer
// [ ] createTask
// [ ] cancelTask
// [ ] curry
// [ ] debug
// [ ] entries
// [x] eq
// [x] exec
// [ ] extend
// [ ] filterBy
// [ ] filter
// [ ] findByInTree
// [x] findBy
// [ ] findInTree
// [x] find
// [ ] first
// [ ] flatten
// [ ] forEach
// [ ] groupBy
// [ ] gt
// [ ] gte
// [ ] id
// [ ] includes
// [ ] injectPipelineIf
// [ ] injectPipeline
// [ ] instantiate
// [ ] isArrayEmpty
// [ ] isArray
// [ ] isEmpty
// [ ] isFunction
// [ ] isNone
// [ ] isNumber
// [ ] isObject
// [ ] isObjectEmpty
// [ ] isPromise
// [ ] isStringEmpty
// [ ] isString
// [ ] join
// [ ] keyMap
// [ ] keys
// [ ] last
// [ ] length
// [ ] log
// [ ] logger
// [ ] lt
// [ ] lte
// [ ] mapBy
// [ ] map
// [ ] match
// [ ] merge
// [ ] neq
// [ ] notEmpty
// [ ] not
// [ ] ownProperties
// [ ] parse
// [ ] pipe
// [ ] pipelineTransformation
// [ ] pipeline
// [ ] pluck
// [ ] proxy
// [ ] range
// [ ] recursive
// [ ] reduce
// [ ] rejectBy
// [ ] reject
// [ ] replace
// [ ] returnNull
// [ ] returnValue
// [ ] sampleMany
// [ ] sample
// [ ] sleep
// [ ] slice
// [ ] sortBy
// [ ] sort
// [ ] split
// [ ] stringify
// [ ] test
// [ ] toObject
// [x] trim
// [ ] truncate
// [ ] uniq
// [ ] values
// [ ] wrapWithArray






function compareEqualityObject(will, was){
  if(will === was){return true}
  const willEntries = [...Object.entries(will)]
  const wasEntries = [...Object.entries(was)]
  return compareEqualityArray(willEntries, wasEntries)
}

function compareEqualityArray(will, was){
  if(will === was){return true}
  if(will.length !== was.length){return false}
  // we assume arrays are the same if their elements pairwise match
  return will.map((willElem, index)=>{
    return compareEquality(willElem, was[index])
  }).reduce((acc, v)=>{ return acc && v }, true)
}

function compareEquality(will, was){
  if(will === was){return true}
  if(Array.isArray(will) && Array.isArray(was)){return compareEqualityArray(will, was)}
  if(will && typeof will === 'object' && was && typeof was === 'object'){return compareEqualityObject(will, was)}
  return false
}


function test(method, args, right, transformer=(a)=>{return a}){
  const subject = lib[method]
  const left = transformer(subject.apply(null, args))

  const cond = compareEquality(left, right)
  //eslint-disable-next-line no-console
  console.info(`[${cond ? 'TRUE' : 'FALSE'}]`, `${method}(${args.map((arg)=>{
    if(typeof arg === 'function'){return arg.toString()}
    return JSON.stringify(arg)
  }).join(", ")}) ===`, right);
  if(cond){return true}
  console.warn(`Assertation failed:`); //eslint-disable-line no-console
  console.warn(`Method ${method}<${args.join(', ')}> Failed\nLeft: \`${JSON.stringify(left)}\`\nRight: \`${JSON.stringify(right)}\`\n`); //eslint-disable-line no-console
  process.exit(1)
}
