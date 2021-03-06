var cc = require('../../lib/cc.js')('resource.provider.fs', 'parser.markdown'),
    _ = require('underscore'),
    path = require('path');

exports.actions = function(req, res, ss) {

  req.use('session');

  var factory = new cc.resource.provider.ResourceFactory();
  var fsprovider = new cc.resource.provider.fs.FsResourceProvider("fs", path.join(process.env.OPENSHIFT_REPO_DIR || "", "resources", "content"), function() {});
  cc.resource.provider.ProviderRegistry.getInstance().registerProvider(fsprovider.getName(), fsprovider);
  cc.parser.ParserRegistry.getInstance().registerParser('md', new cc.parser.markdown.MarkdownParser());
  cc.parser.ParserRegistry.getInstance().registerParser('html', new cc.parser.DefaultParser());

  return {

    loadcontent: function (message) {
      console.log(message);
      try {
        var r = factory.getResource("fs", message.substr(1));
        //console.log(r);
        res(r);
      } catch (err) {
        console.log(err);
      }
    }
  };

};
