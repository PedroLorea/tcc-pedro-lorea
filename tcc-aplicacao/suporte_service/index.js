import express from 'express';
import fs from 'fs';
import natural from 'natural'; // para similaridade de strings
import cors from 'cors';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Carregar FAQ
const faq = JSON.parse(fs.readFileSync('./data/faq.json', 'utf-8'));

// Endpoint de suporte
app.post('/suporte/perguntar/', (req, res) => {
  const { pergunta } = req.body;
  if (!pergunta) return res.status(400).json({ erro: 'Pergunta é obrigatória' });

  // Transformar strings em vetores usando Tokenizer do Natural
  const tokenizer = new natural.WordTokenizer();

  let melhorMatch = null;
  let melhorScore = 0;

  faq.forEach(item => {
    const tokensPergunta = tokenizer.tokenize(pergunta.toLowerCase());
    const tokensItem = tokenizer.tokenize(item.pergunta.toLowerCase());

    // Jaccard Similarity
    const setPergunta = new Set(tokensPergunta);
    const setItem = new Set(tokensItem);
    const intersection = new Set([...setPergunta].filter(x => setItem.has(x)));
    const union = new Set([...setPergunta, ...setItem]);
    const score = intersection.size / union.size;

    if (score > melhorScore) {
      melhorScore = score;
      melhorMatch = item;
    }
  });

  // Retorna resposta se similaridade maior que 0.3, senão resposta padrão
  if (melhorScore > 0.2) {
    res.json({ resposta: melhorMatch.resposta, similaridade: melhorScore });
  } else {
    res.json({ resposta: 'Desculpe, não entendi sua pergunta.' });
  }
});

// Start server
app.listen(8002, () => console.log('Serviço de suporte rodando na porta 8002'));
