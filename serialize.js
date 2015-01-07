module.exports = function(obj, prefix) {
  var str = [];

  for(var key in obj) {
    if(obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(typeof prefix !== 'undefined' ? prefix + key : key) + '=' + encodeURIComponent(obj[key]));
    }
  }

  return str.join('&');
};
