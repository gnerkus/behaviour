const arr = [];
const traceFuncs: (string | symbol)[] = ['push', 'unshift'];
const proxiedArr = new Proxy(arr, {
  get(target, prop, receiver) {
    if (traceFuncs.includes(prop)) {
      return function (item) {
        console.log(`${String(prop)}ing ${item}`);
        return target[prop](...arguments);
      }
    }
    return target[prop];
  },
});

proxiedArr.push('e'); // logs 'pushing e' to the console
proxiedArr.unshift('f'); // logs 'unshifting f' to the console

console.log(arr); // ["f", "e"]
