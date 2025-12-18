const puppeteer = require('puppeteer');
const express = require('express');

const app = express();

async function getTend() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(
    'https://suameca.banrep.gov.co/estadisticas-economicas-back/reporte-oac.html?path=%2FEstadisticas_Banco_de_la_Republica%2F4_Sector_Externo_tasas_de_cambio_y_derivados%2F1_Tasas_de_cambio%2F1_Tasa_de_cambio_del_peso_colombiano_por_USD(TRM)%2F2_Mercado_Interbancario_de_Divisas%2F1_Mercado_interbancario_de_divisas',
    {
      waitUntil: 'networkidle0',
      timeout: 120000
    }
  );

  const values = await page.$$eval(
    '.bi_viz_gridview_cell_text_nowrap',
    els => els.map(e => e.innerText.trim())
  );

  const todayExchangeRate = parseFloat(values[5].replace(',', ''));
  const closingExchangeRate = parseFloat(values[13].replace(',', ''));

  return {
    todayExchangeRate,
    closingExchangeRate
  };
}

// routing
app.get('/', async (req, res) => {
  try {
    const data = await getTend();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `xInternal Server Error ${err.message}` });
  }
});

// start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log('Server started on port 3000');
});
