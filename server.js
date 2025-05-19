require('dotenv').config();
const express = require('express');
const cors = require('cors');

const AZURE_ENDPOINT = process.env.AZURE_ENDPOINT;
const API_KEY = process.env.API_KEY;
const DEPLOYMENT_NAME = process.env.DEPLOYMENT_NAME;

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.post('/predict', async (req, res) => {
    try {
      console.log("📥 Payload recibido:", JSON.stringify(req.body, null, 2));
  
      const response = await fetch(AZURE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + API_KEY,
          "azureml-model-deployment": DEPLOYMENT_NAME
        },
        body: JSON.stringify(req.body)
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Azure ML error:", response.status, errorText);
        return res.status(500).json({ error: "Error en Azure ML", detalle: errorText });
      }
  
      const result = await response.json();
      console.log("✅ Respuesta de Azure ML:", result);
      res.json(result);
  
    } catch (error) {
      console.error("❌ Error en servidor:", error.message);
      res.status(500).json({ error: "Error interno", detalle: error.message });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

