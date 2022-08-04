const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;
const indexBack = require('./index.js');
var Promise = require('bluebird');

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(err);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  var increment = function(err, data) {
    if (err) {
      console.error(err);
      return err;
    } else {
      data = data + 1;
      writeCounter(data, callback);
    }
  };
  readCounter(increment);
};


// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');

exports.eachFile = (input) => {
  var allFiles = [];
  console.log('ARRAY TEST ', input);
  var promiseReadFile = Promise.promisify(fs.readFile);
  input.forEach(file => {
    var id = file.split('.');
    fs.readFile(path.join(indexBack.dataDir, file), 'utf8', (err, text) => {
      if (err) {
        console.log('Error ', err);
      } else {
        console.log('Im Pushing Files');
        allFiles.push({ id: id[0], text: text });
      }
      console.log('I DIDNT STOP AFTER IF/ELSE');
    });
    console.log('I DIDNT STOP AFTER READFILE');
  });
  if (allFiles.length > 1) {
    console.log('I DIDNT STOP AFTER RETURN');
    return allFiles;
  }
};
