function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function rand(start, end) {
  const result = Math.floor(Math.random() * end) + start;
  // console.log(`rand(${start},${end}) = ${result}`);
  return result;
}

module.exports = { uuidv4, rand };