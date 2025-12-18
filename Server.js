const express = require('express');
const { chromium } = require('playwright');

const app = express();

async function getTend() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(
    'https://suameca.banrep.gov.co/estadisticas-economicas-back/reporte-oac.html?path=%2FEstadisticas_Banco_de_la_Republica%2F4_Sector_Externo_tasas_de_cambio_y_derivados%2F1_Tasas_de_cambio%2F1_Tasa_de_cambio_del_peso_colombiano_por_USD(TRM)%2F2_Mercado_Interbancario_de_Divisas%2F1_Mercado_interbancario_de_divisas',
    { waitUntil: 'networkidle' }
  );

  const values = await page.$$eval(
    '.bi_viz_gridview_cell_text_nowrap',
    els => els.map(e => e.innerText.trim())
  );

  await browser.close();

  return {
    todayExchangeRate: parseFloat(values[5].replace(',', '')),
    closingExchangeRate: parseFloat(values[13].replace(',', ''))
  };
}

app.get('/', async (req, res) => {
  try {
    res.json(await getTend());
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: `Internal Server Error: ${e.message}` });
  }
});

const port = process.env.PORT || 3000;
app.listen(port);
