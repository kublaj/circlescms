if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require) {
  var dejavu = require('dejavu');

  var util = {};

  util.PathUtil = dejavu.Class.declare({
    $statics: {
      __suffixRe: /(?:\.([^./]+))?$/,
      getBasename: function(path) {
        if(util.ObjectUtil.isString(path)) {
          var suffix = this.$static.getSuffix(path);
          return path.substring(0, path.length - (suffix ? suffix.length + 1 : 0));
        }
        return "";
      },

      getDirectory: function(path) {
        if(util.ObjectUtil.isString(path)) {
          return path.substring(0, path.lastIndexOf('/') + 1);
        }
        return "";
      },

      getSuffix: function(path) {
        var ret = this.$static.__suffixRe.exec(path)[1];
        return ret ? ret : "";
      },

      isDirectoryPath: function(path) {
        return util.ObjectUtil.isString(path) && path.charAt(path.length-1) == '/';
      }
    }
  });

  util.ObjectUtil = dejavu.Class.declare({
    $statics: {
      getProperty: function(o, s) {
        if(s) {
          s = s.replace(/\[(\w+)\]/g, '.$1');  // convert indexes to properties
          s = s.replace(/^\./, ''); // strip leading dot
          var a = s.split('.');
          while (a.length) {
            var n = a.shift();
            if (n in o) {
              o = o[n];
            } else {
              return;
            }
          }
          return o;
        }
        return;
      },
      
      isDefined: function(o, s) {
          if(o) {
            if(this.$static.isArray(s)) {
              return !!this.$static.getProperty(o, s.join('.'));
            } else if(this.$static.isString(s)) {
              return !!this.$static.getProperty(o, s);
            } else {
              return false;
            }
          }
          return false;
      },

      isString: function(s) {
        return !!s && typeof s === 'string';
      },

      isArray: function(a) {
        return !!a && a instanceof Array;
      }
    }
  });

  util.Preconditions = dejavu.Class.declare({
    $statics: {
      checkNotEmptyString: function(s) {
        if(!util.ObjectUtil.isString(s)) {
          util.ExceptionUtil.throwIllegalArgumentException("Check for non empty String failed: " + s);
        }
      }
    }
  });

  util.ExceptionUtil = dejavu.Class.declare({
    $statics: {
      throwIllegalArgumentException: function(m) {
        this.$static.__throwException("IllegalArgumentException", m);
      },
      throwIllegalStateException: function(m) {
        this.$static.__throwException("IllegalStateException", m);
      },
      __throwException: function(n,m) {
        throw {
          name: n,
          message: m
        };
      }
    }
  });

  return util;
});
