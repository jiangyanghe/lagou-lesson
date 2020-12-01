var a = [];

for (var i=0; i< 10; i++) {
  a[i] = function() {
    console.log(i)
  }
}

a[6]();

// 修改
var b = [];

for (let i=0; i< 10; i++) {
  b[i] = function() {
    console.log(i)
  }
}

b[6]();

console.log(a, b);

// var temp = 123;

// if (true) {
  // console.log(temp);
  // let temp;
// }

var arr = [12, 30, 32, 89, 4];
console.log((arr.sort((a , b) => a - b))[0]);
