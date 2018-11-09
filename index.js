var fs = require('fs');
var path = require('path');

module.exports = {
  name: 'ember-cli-rails-addon',

  init: function() {
    this._super.init && this._super.init.apply(this, arguments);
    this.ensureTmp();
  },

  buildError: function(error) {
    fs.writeFileSync(this.errorFilePath(), error.stack)
  },

  included: function(app) {
    app.options.storeConfigInMeta = false;
    app.options.fingerprint = app.options.fingerprint || {};
    app.options.fingerprint.generateAssetMap = true;
  },

  preBuild: function(result) {
    var lockFile = this.lockFilePath();
    var errorFile = this.errorFilePath();

    if(!fs.existsSync(lockFile)) {
      fs.openSync(lockFile, 'w');
    }

    if(fs.existsSync(errorFile)) {
      fs.unlinkSync(errorFile);
    }
  },

  outputReady: function(result){
    var lockFile = this.lockFilePath();

    if(fs.existsSync(lockFile)) {
      fs.unlinkSync(lockFile);
    }
  },

  ensureTmp: function() {
    var dir = this.tmpDir();

    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
  },

  tmpDir: function() {
    return path.join(process.cwd(), 'tmp');
  },

  lockFilePath: function() {
    return path.join(this.tmpDir(), 'build.lock');
  },

  errorFilePath: function() {
    return path.join(this.tmpDir(), 'error.txt');
  }
};
