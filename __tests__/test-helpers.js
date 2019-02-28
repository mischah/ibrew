module.exports.wait = seconds =>
  new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });
