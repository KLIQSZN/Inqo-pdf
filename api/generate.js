module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { html } = req.body;

  if (!html) {
    return res.status(400).json({ error: 'No HTML provided' });
  }

  try {
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({ margin: 40 });
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
      const pdf = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=strategy.pdf');
      res.send(pdf);
    });

    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    doc.fontSize(10).text(text);
    doc.end();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
