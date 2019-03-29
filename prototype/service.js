let talks;
const request = require("request");
let presentateur;

exports.init = function(callback) {
  talks = [];
  presentateur = [];
  request("http://2018.breizhcamp.org/json/others.json",
    { json: true },
    function(err, res, body) {
      if (err) {
        return console.log("Erreur", err);
      }

      talks = talks.concat(body);
      request("http://2018.breizhcamp.org/json/talks.json",
        { json: true },
        function(err, res, body) {
          if (err) {
            return console.log("Erreur", err);
          }

          talks = talks.concat(body);
          callback(talks.length);
        }
      );
    }
  );
};

exports.init2 = function init2() {
  talks = [];
  presentateur = [];
  return new Promise(function (resolve, reject) {
    "http://2018.breizhcamp.org/json/others.json",
      { json: true },
      function (err, res, body) {
        if (err) {
          reject(err);
        } else {
          const jsdom = require("jsdom");
          const fs = require("fs");
          const dom = new jsdom.JSDOM(body);
          const pres = dom.window.document.querySelectorAll(".media-heading");
          pres.forEach(function (lg) {
            presentateur.push(lg.innerHTML);
            console.log(lg.innerHTML);
          });
          resolve(presentateur);
        }
      };
  });
}



exports.presents = function presents() {
  return new Promise(function (resolve, reject) {
    request("http://2018.breizhcamp.org/conference/speakers", {}, function(err, res, body) {
      if (err) {
        reject(err);
      } else {
        const jsdom = require("jsdom");
        const fs = require("fs");
        const dom = new jsdom.JSDOM(body);
        const pres = dom.window.document.querySelectorAll(".media-heading");
        pres.forEach(function(lg) {
          presentateur.push(lg.innerHTML);
          console.log(lg.innerHTML);
        });
        resolve(presentateur);
      }
    });
  });
}

exports.session = function(callback) {
   if (talks) {
     callback(talks);
   } else {
     exports.init(function(nbrSession) {
       callback(talks);
     });
   }
 };