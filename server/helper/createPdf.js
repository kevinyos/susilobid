const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const handlebars = require('handlebars');
const path = require('path');

const compile = async (templateName, data) => {
  // merubah handlebars ke html
  const filePath = path.join(process.cwd(), 'templates', `${templateName}/html.hbs`);
  const html = await fs.readFile(filePath, 'utf-8');

  return handlebars.compile(html)(data);
};

const htmlToPdf = data => {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      const content = await compile('pdf', data);
      
      await fs.writeFile(`${process.cwd()}/temp/${data.invNum}.html`, content);
      const filePath = path.join(process.cwd(), `/temp/${data.invNum}.html`);
      await page.goto(`file:${filePath}`, {waitUntil: 'networkidle0'});
      await page.pdf({
        path: path.join(process.cwd(), `/public/invoice/${data.invNum}.pdf`),
        format: 'A4',
        printBackground: true
      });
      await browser.close();
      await fs.unlink(filePath);

      resolve({
        sqlLink: `/invoice/${data.invNum}.pdf`
      });
    } catch (err) {
      reject(Error(err));
    }
  });
};

module.exports = {
  htmlToPdf,
  compile
};
