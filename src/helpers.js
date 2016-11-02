export function asyncIterator(data, fn, done) {
  let i = 0;
  function iterate() {
    fn(data[i], () => {
      i++;
      if (i > data.length - 1) {
        done();
      } else {
        iterate();
      }
    });
  }
  iterate();
}
