const fs = require("fs");
const hljs = require("highlight.js");
const MarkdownIt = require("markdown-it");

const md = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    return "";
  }
});

module.exports = {
  routes: {
    get: {
      "readme-html": (req, res) => {
        const appRoot = req.app.locals.appRoot;
        const config = req.app.locals.config;

        const path = `${appRoot}/README.md`;
        if (!fs.existsSync(path)) {
          return res.send({ result: false });
        }

        const readmeMd = fs.readFileSync(path).toString();
        let html = md.render(readmeMd);

        //rewrite links to open in new tab
        html = html.replace(
          /\<a href=/g,
          "<a target='_blank' rel='noopener' href="
        );

        return res.send({ result: { html } });
      }
    }
  }
};
