export default function handler(req, res) {
  res.status(200).json({
    status: 'online',
    store: 'Hand Embroidered Dresses Multan',
    timestamp: new Date().toISOString()
  });
}
