const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Allow browser to call this proxy from localhost:8081 (Expo web)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Proxy any /api/* request to the real API server
app.use('/api', async (req, res) => {
  try {
    const targetUrl = 'https://cis.kku.ac.th' + req.originalUrl;
    // copy headers but remove host to avoid conflicts
    const headers = Object.assign({}, req.headers);
    delete headers.host;

    // Forward the request
    const fetchOpts = {
      method: req.method,
      headers,
      redirect: 'follow',
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      // prefer raw body if present
      if (req.body && Object.keys(req.body).length > 0) {
        // if content-type is json, stringify
        if (req.is('application/json')) fetchOpts.body = JSON.stringify(req.body);
        else fetchOpts.body = req.body;
      }
    }

    const upstream = await fetch(targetUrl, fetchOpts);
    // copy selected upstream headers to the response (avoid exposing upstream CORS)
    upstream.headers.forEach((value, name) => {
      if (!['access-control-allow-origin', 'access-control-allow-methods', 'access-control-allow-headers'].includes(name.toLowerCase())) {
        res.setHeader(name, value);
      }
    });

    const text = await upstream.text();
    res.status(upstream.status).send(text);
  } catch (err) {
    console.error('Proxy error', err);
    res.status(502).send({ error: 'Bad gateway', detail: String(err) });
  }
});

app.listen(PORT, () => console.log(`Dev proxy listening on http://localhost:${PORT} -> https://cis.kku.ac.th`));
