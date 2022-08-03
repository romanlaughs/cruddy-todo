const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, data) => {
    if (err) {
      console.error('ID Error: ', err);
    } else {
      var id = data;
      var idDotTxt = id.concat('.txt');
      var filePath = path.join(exports.dataDir, idDotTxt);
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          console.error('Write Error: ', err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   console.log({ id, text });
  //   return { id, text };
  // });
  var directory = fs.readdirSync(exports.dataDir);
  var files = [];
  for (var i = 0; i < directory.length; i++) {
    var container = {};
    var noDotTxt = directory[i].split('.');
    container.id = noDotTxt[0];
    container.text = noDotTxt[0];
    files.push(container);
  }
  callback(null, files);
};

exports.readOne = (id, callback) => {
  var idDotTxt = id.concat('.txt');
  var filePath = path.join(exports.dataDir, idDotTxt);
  fs.readFile(filePath, 'utf8', (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  var idDotTxt = id.concat('.txt');
  var filePath = path.join(exports.dataDir, idDotTxt);
  fs.readFile(filePath, 'utf8', (err, currentText) => {
    if (err) {
      callback('Error', currentText);
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          console.error('Write Error: ', err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {

  var idDotTxt = id.concat('.txt');
  var filePath = path.join(exports.dataDir, idDotTxt);
  fs.readFile(filePath, 'utf8', (err, currentText) => {
    if (err) {
      callback('Error', currentText);
    } else {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Delete Error: ', err);
        } else {
          callback(null, { id });
        }
      });
    }
  });


  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
