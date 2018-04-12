const fs = require("fs");
const md = require("markdown-it")({
  html: true,
  linkify: true,
  typographer: true
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
