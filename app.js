/**
 * Meu Caixa — Controle Financeiro Pessoal
 * Logos de marcas reais, símbolos temáticos, abas laterais e visão anual
 */

const STORAGE_KEY = 'meu_caixa_clean_v2';
try {
  localStorage.removeItem('pierre_controle_gastos_v1');
} catch {}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const MONTH_SHORT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

function formatBRL(value) {
  return brlFormatter.format(Number(value) || 0);
}

function formatCompactBRL(value) {
  const num = Number(value) || 0;
  if (Math.abs(num) >= 1000) {
    return `R$ ${(num / 1000).toFixed(1).replace('.', ',')}k`;
  }
  return `R$ ${num.toFixed(0)}`;
}

// ============================================================================
// CATALOG OF REAL BRAND LOGOS & CONTEXTUAL SYMBOLS
// ============================================================================
const ICON_CATALOG = {
  // --- BRANDS / ASSINATURAS & LOJAS ---
  spotify: {
    label: 'Spotify',
    type: 'brand',
    color: '#1DB954',
    bg: 'rgba(29, 185, 84, 0.15)',
    defaultCategory: 'Assinatura / Streaming',
    keywords: ['spotify', 'musica', 'música'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.469-.077-.336.132-.67.469-.746 3.809-.87 7.076-.496 9.713 1.115.293.18.386.563.207.856zm1.224-2.722c-.226.367-.706.482-1.072.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.127-.848-.106-.973-.517-.125-.413.108-.848.52-.973 3.632-1.102 8.147-.568 11.234 1.328.366.226.48.707.256 1.071zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.493.15-1.016-.129-1.166-.623-.148-.495.13-1.017.625-1.167 3.532-1.073 9.404-.866 13.115 1.337.445.264.59.838.327 1.282-.264.443-.838.59-1.283.328z"/></svg>`
  },
  prime: {
    label: 'Amazon Prime',
    type: 'brand',
    color: '#00A8E1',
    bg: 'rgba(0, 168, 225, 0.16)',
    defaultCategory: 'Assinatura / Streaming',
    keywords: ['amazon', 'prime', 'prime video', 'amazon prime'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15.5c4.5 3.6 12.8 4 17.5.5"/><path d="M18 13.5c1.4.4 2.8 1.5 2.7 2.8-.1 1.1-1.2 2.2-2.2 2.7"/><path d="M7 9.5V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3.5"/></svg>`
  },
  netflix: {
    label: 'Netflix',
    type: 'brand',
    color: '#E50914',
    bg: 'rgba(229, 9, 20, 0.16)',
    defaultCategory: 'Assinatura / Streaming',
    keywords: ['netflix'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.5 3h3.6l5.8 12.5V3h3.6v18h-3.5L9.1 8.4V21H5.5V3z"/></svg>`
  },
  youtube: {
    label: 'YouTube',
    type: 'brand',
    color: '#FF0033',
    bg: 'rgba(255, 0, 51, 0.16)',
    defaultCategory: 'Assinatura / Streaming',
    keywords: ['youtube', 'yt premium', 'youtube music'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z"/></svg>`
  },
  apple: {
    label: 'Apple / iCloud',
    type: 'brand',
    color: '#F1F5F9',
    bg: 'rgba(241, 245, 249, 0.14)',
    defaultCategory: 'Assinatura / Streaming',
    keywords: ['apple', 'icloud', 'apple music', 'apple tv', 'iphone'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>`
  },
  mercadolivre: {
    label: 'Meli+',
    type: 'brand',
    color: '#A855F7',
    bg: 'rgba(168, 85, 247, 0.16)',
    defaultCategory: 'Assinatura / Streaming',
    keywords: ['meli+', 'meli plus', 'assinatura meli'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M6 15V9l3.5 3.5L13 9v6"/><path d="M17.5 9.5v5M15 12h5"/></svg>`
  },
  mercadolivre_loja: {
    label: 'Mercado Livre',
    type: 'brand',
    color: '#FACC15',
    bg: 'rgba(250, 204, 21, 0.16)',
    defaultCategory: 'Compras',
    keywords: ['mercado livre', 'mercadolivre', 'mercadopago'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="12" rx="10" ry="7"/><path d="M7 12l3 2.5L13 11l4 3"/><path d="M8 9.5c1.5-1 3-1 4.5 0 1.5-1 3-1 4.5 0"/></svg>`
  },
  shopee: {
    label: 'Shopee',
    type: 'brand',
    color: '#EE4D2D',
    bg: 'rgba(238, 77, 45, 0.16)',
    defaultCategory: 'Compras',
    keywords: ['shopee'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7h14l-1 13H6L5 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/><path d="M14 11.5c-.5-.8-2.5-1-3-.2-.6.9.5 1.8 2 2.2 1.5.4 2 1.5 1.2 2.4-.8.9-2.8.6-3.4-.3"/></svg>`
  },
  tiktokshop: {
    label: 'TikTok Shop',
    type: 'brand',
    color: '#00F2FE',
    bg: 'rgba(0, 242, 254, 0.15)',
    defaultCategory: 'Compras',
    keywords: ['tiktok', 'tiktok shop', 'tik tok'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>`
  },
  ifood: {
    label: 'iFood',
    type: 'brand',
    color: '#F43F5E',
    bg: 'rgba(244, 63, 94, 0.16)',
    defaultCategory: 'Alimentação',
    keywords: ['ifood', 'delivery', 'entrega'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8.5" cy="9" r="1.5" fill="currentColor"/><circle cx="14.5" cy="9" r="1.5" fill="currentColor"/><path d="M6.5 14.5c2 2.8 7.5 3 10.5-.5"/><path d="M15 16.5l3.5-2.5-.5 4"/></svg>`
  },
  uber: {
    label: 'Uber / 99',
    type: 'brand',
    color: '#E2E8F0',
    bg: 'rgba(226, 232, 240, 0.14)',
    defaultCategory: 'Combustível / Transporte',
    keywords: ['uber', '99', '99pop', 'corrida', 'taxi', 'táxi'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M3 12h6"/></svg>`
  },
  nubank: {
    label: 'Nubank / Cartão',
    type: 'brand',
    color: '#A855F7',
    bg: 'rgba(168, 85, 247, 0.18)',
    defaultCategory: 'Outros Fixos',
    keywords: ['nubank', 'ultravioleta', 'fatura', 'cartao', 'cartão'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16V9a3 3 0 0 1 6 0v7"/><path d="M14 8v7a3 3 0 0 0 6 0V8"/></svg>`
  },
  google: {
    label: 'Google',
    type: 'brand',
    color: '#4285F4',
    bg: 'rgba(66, 133, 244, 0.16)',
    defaultCategory: 'Assinatura / Streaming',
    keywords: ['google', 'google one', 'drive', 'gmail', 'gemini', 'google cloud', 'play store'],
    svg: `<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>`
  },
  playstation: {
    label: 'Jogos',
    type: 'brand',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.16)',
    defaultCategory: 'Lazer',
    keywords: ['jogos', 'jogo', 'game', 'playstation', 'psn', 'ps plus', 'steam'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="4"/><path d="M6 12h4M8 10v4"/><circle cx="15" cy="11" r="1" fill="currentColor"/><circle cx="17" cy="13" r="1" fill="currentColor"/></svg>`
  },

  // --- CONTEXTUAL SYMBOLS (SÍMBOLOS TEMÁTICOS) ---
  fuel: {
    label: 'Gasolina',
    type: 'symbol',
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.16)',
    defaultCategory: 'Combustível / Transporte',
    keywords: ['gasolina', 'combustivel', 'combustível', 'posto', 'etanol', 'alcool', 'álcool', 'diesel', 'abastecimento', 'shell', 'ipiranga', 'petrobras'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="15" y1="22" y2="22"/><line x1="4" x2="14" y1="9" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/></svg>`
  },
  restaurant: {
    label: 'Restaurante',
    type: 'symbol',
    color: '#F97316',
    bg: 'rgba(249, 115, 22, 0.16)',
    defaultCategory: 'Alimentação',
    keywords: ['restaurante', 'almoco', 'almoço', 'jantar', 'churrascaria', 'churrasco', 'sushi', 'pizzaria', 'pizza', 'outback', 'marmita', 'refeicao', 'refeição'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`
  },
  burger: {
    label: 'Lanche / Fast Food',
    type: 'symbol',
    color: '#EAB308',
    bg: 'rgba(234, 179, 8, 0.16)',
    defaultCategory: 'Alimentação',
    keywords: ['lanche', 'hamburguer', 'hambúrguer', 'mcdonalds', 'bk', 'burger king', 'pastel', 'salgado', 'sorvete', 'acai', 'açaí'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11h16a1 1 0 0 0 1-1c0-3.87-3.8-7-8.5-7h-1C6.8 3 3 6.13 3 10a1 1 0 0 0 1 1Z"/><path d="M3 15h18"/><path d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2"/><path d="m3 13 3 1 3-1 3 1 3-1 3 1 3-1"/></svg>`
  },
  coffee: {
    label: 'Padaria',
    type: 'symbol',
    color: '#D97706',
    bg: 'rgba(217, 119, 6, 0.16)',
    defaultCategory: 'Alimentação',
    keywords: ['padaria', 'cafe', 'café', 'pao', 'pão', 'starbucks', 'doce', 'bolo'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>`
  },
  cart: {
    label: 'Supermercado',
    type: 'symbol',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.16)',
    defaultCategory: 'Supermercado',
    keywords: ['mercado', 'supermercado', 'feira', 'atacadao', 'atacadão', 'assai', 'assaí', 'carrefour', 'compras do mes', 'hortifruti', 'açougue', 'acougue'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`
  },
  pharmacy: {
    label: 'Farmácia',
    type: 'symbol',
    color: '#F43F5E',
    bg: 'rgba(244, 63, 94, 0.16)',
    defaultCategory: 'Farmácia',
    keywords: ['farmacia', 'farmácia', 'remedio', 'remédio', 'drogasil', 'droga raia', 'pague menos', 'panvel', 'ultrafarma', 'medicamento'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>`
  },
  health: {
    label: 'Saúde',
    type: 'symbol',
    color: '#06B6D4',
    bg: 'rgba(6, 182, 212, 0.16)',
    defaultCategory: 'Saúde',
    keywords: ['saude', 'saúde', 'medico', 'médico', 'consulta', 'exame', 'dentista', 'hospital', 'psicologo', 'psicólogo', 'terapia', 'plano de saude', 'unimed'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>`
  },
  gym: {
    label: 'Academia',
    type: 'symbol',
    color: '#84CC16',
    bg: 'rgba(132, 204, 22, 0.16)',
    defaultCategory: 'Saúde & Academia',
    keywords: ['academia', 'smart fit', 'smartfit', 'gympass', 'wellhub', 'treino', 'whey', 'creatina', 'suplemento', 'crossfit', 'natacao'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>`
  },
  electricity: {
    label: 'Luz',
    type: 'symbol',
    color: '#FACC15',
    bg: 'rgba(250, 204, 21, 0.16)',
    defaultCategory: 'Moradia / Contas',
    keywords: ['luz', 'energia', 'conta de luz', 'enel', 'cpfl', 'cemig', 'copel', 'eletricidade'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`
  },
  water: {
    label: 'Água',
    type: 'symbol',
    color: '#22D3EE',
    bg: 'rgba(34, 211, 238, 0.16)',
    defaultCategory: 'Moradia / Contas',
    keywords: ['agua', 'água', 'sabesp', 'sanepar', 'copasa', 'saneamento'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>`
  },
  wifi: {
    label: 'Internet / Celular',
    type: 'symbol',
    color: '#60A5FA',
    bg: 'rgba(96, 165, 250, 0.16)',
    defaultCategory: 'Internet & Celular',
    keywords: ['internet', 'fibra', 'wifi', 'wi-fi', 'vivo', 'claro', 'tim', 'oi', 'celular', 'plano movel'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg>`
  },
  car: {
    label: 'Carro',
    type: 'symbol',
    color: '#38BDF8',
    bg: 'rgba(56, 189, 248, 0.16)',
    defaultCategory: 'Combustível / Transporte',
    keywords: ['carro', 'moto', 'mecanico', 'mecânico', 'oficina', 'estacionamento', 'pedagio', 'pedágio', 'ipva', 'seguro auto', 'lavagem', 'pneu', 'oleo'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`
  },
  shopping: {
    label: 'Roupas',
    type: 'symbol',
    color: '#EC4899',
    bg: 'rgba(236, 72, 153, 0.16)',
    defaultCategory: 'Compras',
    keywords: ['roupa', 'roupas', 'camisa', 'calça', 'tenis', 'tênis', 'sapato', 'shein', 'loja', 'perfume'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>`
  },
  drinks: {
    label: 'Bar / Bebidas / Rolê',
    type: 'symbol',
    color: '#C084FC',
    bg: 'rgba(192, 132, 252, 0.16)',
    defaultCategory: 'Lazer',
    keywords: ['bar', 'cerveja', 'bebida', 'festa', 'balada', 'role', 'rolê', 'chopp', 'vinho'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"/><path d="M12 15v7"/><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/></svg>`
  },
  barber: {
    label: 'Cabelo',
    type: 'symbol',
    color: '#2DD4BF',
    bg: 'rgba(45, 212, 191, 0.16)',
    defaultCategory: 'Outros',
    keywords: ['cabelo', 'corte', 'barbearia', 'barbeiro', 'salao', 'salão', 'manicure', 'estetica', 'estética'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/></svg>`
  },
  cinema: {
    label: 'Cinema / Ingresso',
    type: 'symbol',
    color: '#A78BFA',
    bg: 'rgba(167, 139, 250, 0.16)',
    defaultCategory: 'Lazer',
    keywords: ['cinema', 'ingresso', 'show', 'teatro', 'evento', 'pipoca'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>`
  },
  study: {
    label: 'Faculdade / Curso',
    type: 'symbol',
    color: '#6366F1',
    bg: 'rgba(99, 102, 241, 0.16)',
    defaultCategory: 'Educação',
    keywords: ['faculdade', 'curso', 'escola', 'livro', 'livros', 'ingles', 'inglês', 'udemy', 'alura', 'estudo'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`
  },
  travel: {
    label: 'Viagem / Hotel',
    type: 'symbol',
    color: '#38BDF8',
    bg: 'rgba(56, 189, 248, 0.16)',
    defaultCategory: 'Lazer',
    keywords: ['viagem', 'passagem', 'hotel', 'airbnb', 'aviao', 'avião', 'onibus', 'ônibus'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`
  },
  gift: {
    label: 'Presente',
    type: 'symbol',
    color: '#FB7185',
    bg: 'rgba(251, 113, 133, 0.16)',
    defaultCategory: 'Compras',
    keywords: ['presente', 'aniversario', 'aniversário', 'lembrancinha', 'doacao'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>`
  },
  pix_transfer: {
    label: 'Transferência de PIX',
    type: 'symbol',
    color: '#2DD4BF',
    bg: 'rgba(45, 212, 191, 0.16)',
    defaultCategory: 'Outros',
    keywords: ['pix', 'transferencia', 'transferência', 'transferencia de pix'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 2 12l10 10 10-10L12 2Z"/><path d="m8.5 8.5 7 7"/><path d="m15.5 8.5-7 7"/></svg>`
  },
  pix: {
    label: 'Outros',
    type: 'symbol',
    color: '#94A3B8',
    bg: 'rgba(148, 163, 184, 0.15)',
    defaultCategory: 'Outros',
    keywords: ['outros', 'diversos'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>`
  }
};

const FIXED_QUICK_PRESETS = [
  { key: 'spotify', name: 'Spotify', category: 'Assinatura / Streaming' },
  { key: 'prime', name: 'Amazon Prime', category: 'Assinatura / Streaming' },
  { key: 'netflix', name: 'Netflix', category: 'Assinatura / Streaming' },
  { key: 'youtube', name: 'YouTube', category: 'Assinatura / Streaming' },
  { key: 'apple', name: 'Apple / iCloud', category: 'Assinatura / Streaming' },
  { key: 'mercadolivre', name: 'Meli+', category: 'Assinatura / Streaming' },
  { key: 'google', name: 'Google', category: 'Assinatura / Streaming' },
  { key: 'gym', name: 'Academia', category: 'Saúde & Academia' },
  { key: 'wifi', name: 'Internet / Celular', category: 'Internet & Celular' },
  { key: 'electricity', name: 'Luz', category: 'Moradia / Contas' },
  { key: 'water', name: 'Água', category: 'Moradia / Contas' }
];

const VARIABLE_QUICK_PRESETS = [
  { key: 'fuel', name: 'Gasolina', category: 'Combustível / Transporte' },
  { key: 'restaurant', name: 'Restaurante', category: 'Alimentação' },
  { key: 'cart', name: 'Supermercado', category: 'Supermercado' },
  { key: 'burger', name: 'Lanche / Fast Food', category: 'Alimentação' },
  { key: 'ifood', name: 'iFood', category: 'Alimentação' },
  { key: 'coffee', name: 'Padaria', category: 'Alimentação' },
  { key: 'uber', name: 'Uber / 99', category: 'Combustível / Transporte' },
  { key: 'shopee', name: 'Shopee', category: 'Compras' },
  { key: 'tiktokshop', name: 'TikTok Shop', category: 'Compras' },
  { key: 'mercadolivre_loja', name: 'Mercado Livre', category: 'Compras' },
  { key: 'prime', name: 'Amazon Prime', category: 'Compras' },
  { key: 'shopping', name: 'Roupas', category: 'Compras' },
  { key: 'playstation', name: 'Jogos', category: 'Lazer' },
  { key: 'pharmacy', name: 'Farmácia', category: 'Farmácia' },
  { key: 'health', name: 'Saúde', category: 'Saúde' },
  { key: 'drinks', name: 'Bar / Bebidas / Rolê', category: 'Lazer' },
  { key: 'car', name: 'Carro', category: 'Combustível / Transporte' },
  { key: 'barber', name: 'Cabelo', category: 'Outros' },
  { key: 'cinema', name: 'Cinema / Ingresso', category: 'Lazer' },
  { key: 'pix_transfer', name: 'Transferência de PIX', category: 'Outros' },
  { key: 'pix', name: 'Outros', category: 'Outros' }
];

/**
 * Automatically resolves which brand logo or thematic symbol applies to an expense
 */
function resolveExpenseVisual(item) {
  if (item && item.iconKey && ICON_CATALOG[item.iconKey]) {
    return { key: item.iconKey, ...ICON_CATALOG[item.iconKey] };
  }

  const text = `${(item && item.name) || ''} ${(item && item.category) || ''}`.toLowerCase();

  for (const [key, def] of Object.entries(ICON_CATALOG)) {
    if (def.keywords && def.keywords.some((kw) => text.includes(kw))) {
      return { key, ...def };
    }
  }

  // Fallback by category
  const cat = ((item && item.category) || '').toLowerCase();
  if (cat.includes('combust') || cat.includes('transporte')) return { key: 'fuel', ...ICON_CATALOG.fuel };
  if (cat.includes('alimenta')) return { key: 'restaurant', ...ICON_CATALOG.restaurant };
  if (cat.includes('mercado')) return { key: 'cart', ...ICON_CATALOG.cart };
  if (cat.includes('farmácia') || cat.includes('farmacia')) return { key: 'pharmacy', ...ICON_CATALOG.pharmacy };
  if (cat.includes('saúde') || cat.includes('saude')) return { key: 'health', ...ICON_CATALOG.health };
  if (cat.includes('moradia')) return { key: 'electricity', ...ICON_CATALOG.electricity };
  if (cat.includes('internet')) return { key: 'wifi', ...ICON_CATALOG.wifi };
  if (cat.includes('lazer')) return { key: 'cinema', ...ICON_CATALOG.cinema };
  if (cat.includes('compras')) return { key: 'shopping', ...ICON_CATALOG.shopping };

  return { key: 'pix', ...ICON_CATALOG.pix };
}

function renderBrandBoxHTML(item, size = 38) {
  const vis = resolveExpenseVisual(item);
  return `
    <div class="brand-logo-box" style="width:${size}px;height:${size}px;background:${vis.bg};color:${vis.color};border-color:${vis.color}33;" title="${vis.label}">
      ${vis.svg}
    </div>
  `;
}

// ============================================================================
// DATE & STATE HELPERS
// ============================================================================
function getTodayMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getTodayISO() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function formatMonthLabel(monthKey) {
  const [y, m] = monthKey.split('-').map(Number);
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

function formatDateBR(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateStr;
}

function uid() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36).slice(-4);
}

function escapeHTML(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getEmptyState() {
  return {
    defaultSalary: 0,
    fixedExpenses: [],
    pinnedObservations: [],
    months: {}
  };
}

const IS_LOCAL_ENV =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.protocol === 'file:');

const API_BASE = 'http://localhost:3333';
const IDB_NAME = 'MeuCaixaBancoLocalDB';
const IDB_STORE = 'estado_financeiro';

const AUTH_CURRENT_USER_KEY = 'meu_caixa_current_user_v2';
const AUTH_SAVED_ACCOUNTS_KEY = 'meu_caixa_saved_accounts_v2';
const GOOGLE_CLIENT_ID_KEY = 'meu_caixa_google_client_id';

let currentUser = loadCurrentUser();
let currentMonthKey = getTodayMonthKey();
let selectedYear = Number(currentMonthKey.split('-')[0]);
let activeTab = 'overview';
let state = loadState();

function loadCurrentUser() {
  try {
    const raw = localStorage.getItem(AUTH_CURRENT_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.email) return parsed;
    return null;
  } catch {
    return null;
  }
}

function getSavedAccounts() {
  try {
    const raw = localStorage.getItem(AUTH_SAVED_ACCOUNTS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function saveAccountToRegistry(account) {
  const list = getSavedAccounts();
  const cleanEmail = account.email.trim().toLowerCase();
  const idx = list.findIndex((a) => a.email.toLowerCase() === cleanEmail);
  const entry = {
    name: account.name.trim(),
    email: cleanEmail,
    picture: account.picture || '',
    pinHash: account.pinHash || (idx !== -1 ? list[idx].pinHash || '' : ''),
    lastLoginAt: new Date().toISOString()
  };
  if (idx !== -1) {
    list[idx] = entry;
  } else {
    list.unshift(entry);
  }
  localStorage.setItem(AUTH_SAVED_ACCOUNTS_KEY, JSON.stringify(list));
}

function getUserStorageKey() {
  if (currentUser && currentUser.email) {
    return `${STORAGE_KEY}_${currentUser.email.trim().toLowerCase()}`;
  }
  return STORAGE_KEY;
}

function getUserIdbKey() {
  if (currentUser && currentUser.email) {
    return `user_${currentUser.email.trim().toLowerCase()}`;
  }
  return 'main';
}

function loadState() {
  try {
    const key = getUserStorageKey();
    const raw = localStorage.getItem(key);
    if (!raw) {
      const empty = getEmptyState();
      localStorage.setItem(key, JSON.stringify(empty));
      return empty;
    }
    const parsed = JSON.parse(raw);
    return {
      defaultSalary: Number(parsed.defaultSalary) || 0,
      fixedExpenses: Array.isArray(parsed.fixedExpenses) ? parsed.fixedExpenses : [],
      pinnedObservations: Array.isArray(parsed.pinnedObservations) ? parsed.pinnedObservations : [],
      months: parsed.months && typeof parsed.months === 'object' ? parsed.months : {}
    };
  } catch (e) {
    return getEmptyState();
  }
}

// Persistência em IndexedDB do navegador (separada por conta Google)
function saveToIndexedDB(data) {
  try {
    const idbKey = getUserIdbKey();
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(JSON.parse(JSON.stringify(data)), idbKey);
    };
  } catch {}
}

function loadFromIndexedDB() {
  return new Promise((resolve) => {
    try {
      const idbKey = getUserIdbKey();
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = (e) => {
        const db = e.target.result;
        const tx = db.transaction(IDB_STORE, 'readonly');
        const getReq = tx.objectStore(IDB_STORE).get(idbKey);
        getReq.onsuccess = () => resolve(getReq.result || null);
        getReq.onerror = () => resolve(null);
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function syncStateToSQLite() {
  if (!IS_LOCAL_ENV) return;
  try {
    await fetch(`${API_BASE}/api/state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userEmail: currentUser ? currentUser.email : '',
        userName: currentUser ? currentUser.name : '',
        userPicture: currentUser ? currentUser.picture || '' : '',
        state
      })
    });
  } catch (err) {
    // Fallback silencioso para IndexedDB + localStorage
  }
}

async function initSQLiteDatabase() {
  const storageKey = getUserStorageKey();
  if (!IS_LOCAL_ENV) {
    const idbData = await loadFromIndexedDB();
    if (idbData && typeof idbData === 'object') {
      const hasLocalData =
        state.defaultSalary > 0 ||
        state.fixedExpenses.length > 0 ||
        Object.keys(state.months || {}).length > 0;
      if (!hasLocalData) {
        state = {
          defaultSalary: Number(idbData.defaultSalary) || 0,
          fixedExpenses: Array.isArray(idbData.fixedExpenses) ? idbData.fixedExpenses : [],
          pinnedObservations: Array.isArray(idbData.pinnedObservations) ? idbData.pinnedObservations : [],
          months: idbData.months && typeof idbData.months === 'object' ? idbData.months : {}
        };
        localStorage.setItem(storageKey, JSON.stringify(state));
        renderAll();
      }
    }
    saveToIndexedDB(state);
    return;
  }

  try {
    const userQuery = currentUser && currentUser.email ? `?user=${encodeURIComponent(currentUser.email)}` : '';
    const res = await fetch(`${API_BASE}/api/state${userQuery}`);
    if (!res.ok) throw new Error('Servidor SQLite offline');
    const payload = await res.json();
    if (payload && payload.ok) {
      if (payload.isEmptyDatabase) {
        await syncStateToSQLite();
      } else if (payload.state) {
        state = {
          defaultSalary: Number(payload.state.defaultSalary) || 0,
          fixedExpenses: Array.isArray(payload.state.fixedExpenses) ? payload.state.fixedExpenses : [],
          pinnedObservations: Array.isArray(payload.state.pinnedObservations) ? payload.state.pinnedObservations : [],
          months: payload.state.months && typeof payload.state.months === 'object' ? payload.state.months : {}
        };
        localStorage.setItem(storageKey, JSON.stringify(state));
        saveToIndexedDB(state);
        renderAll();
      }
    }
  } catch (err) {
    saveToIndexedDB(state);
  }
}

function saveState() {
  localStorage.setItem(getUserStorageKey(), JSON.stringify(state));
  saveToIndexedDB(state);
  syncStateToSQLite();
}

function ensureMonthBucket(monthKey) {
  if (!state.months[monthKey]) {
    state.months[monthKey] = {
      salaryOverride: null,
      extraIncome: 0,
      extraIncomeNote: '',
      paidFixedIds: [],
      variableExpenses: [],
      notepad: '',
      observations: []
    };
  }
  return state.months[monthKey];
}

// ============================================================================
// METRICS & CALCULATIONS
// ============================================================================
function computeMonthMetrics(monthKey) {
  const bucket = ensureMonthBucket(monthKey);
  const baseSalary =
    bucket.salaryOverride !== null && bucket.salaryOverride !== undefined
      ? Number(bucket.salaryOverride)
      : Number(state.defaultSalary) || 0;

  const extraIncome = Number(bucket.extraIncome) || 0;
  const totalIncome = baseSalary + extraIncome;

  const activeFixed = state.fixedExpenses.filter((x) => x.active !== false);
  const totalFixed = activeFixed.reduce((sum, x) => sum + (Number(x.amount) || 0), 0);

  const variableList = bucket.variableExpenses || [];
  const totalVariable = variableList.reduce((sum, x) => sum + (Number(x.amount) || 0), 0);

  const totalOut = totalFixed + totalVariable;
  const balance = totalIncome - totalOut;
  const savingsPct = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  return {
    baseSalary,
    extraIncome,
    extraIncomeNote: bucket.extraIncomeNote || '',
    totalIncome,
    activeFixedCount: activeFixed.length,
    totalFixed,
    variableCount: variableList.length,
    totalVariable,
    totalOut,
    balance,
    savingsPct
  };
}

// ============================================================================
// TAB SWITCHING & MAIN RENDER
// ============================================================================
function switchTab(tabId) {
  activeTab = tabId;
  document.querySelectorAll('.nav-tab').forEach((btn) => {
    btn.classList.toggle('is-active', btn.getAttribute('data-tab') === tabId);
  });
  document.querySelectorAll('.tab-view').forEach((sec) => {
    sec.classList.toggle('is-active', sec.id === `tab-${tabId}`);
  });
  renderAll();
}

function renderAll() {
  const monthLabel = formatMonthLabel(currentMonthKey);
  document.getElementById('currentMonthLabel').textContent = monthLabel;
  document.querySelectorAll('.month-highlight').forEach((el) => {
    el.textContent = monthLabel;
  });

  const m = computeMonthMetrics(currentMonthKey);

  renderSidebarStatus(m);
  renderOverviewTab(m, monthLabel);
  renderSalaryTab(m);
  renderFixedTab(m);
  renderVariableTab(m);
  renderNotesTab();
  renderAnnualTab();
}

function renderSidebarStatus(m) {
  // Badges on left menu
  document.getElementById('navBadgeSalary').textContent = formatCompactBRL(m.totalIncome);
  document.getElementById('navBadgeFixed').textContent = m.activeFixedCount;
  document.getElementById('navBadgeVariable').textContent = m.variableCount;

  const bucket = ensureMonthBucket(currentMonthKey);
  const notesCount = (state.pinnedObservations || []).length + (bucket.observations || []).length + (bucket.notepad ? 1 : 0);
  document.getElementById('navBadgeNotes').textContent = notesCount;
  document.getElementById('navBadgeYear').textContent = selectedYear;

  // Sidebar Live Wallet Widget
  const balVal = document.getElementById('sidebarBalanceValue');
  const balLabel = document.getElementById('sidebarBalanceLabel');
  const balDot = document.getElementById('sidebarBalanceDot');
  const balFill = document.getElementById('sidebarBalanceFill');
  const balMeta = document.getElementById('sidebarBalanceMeta');

  balVal.textContent = formatBRL(m.balance);

  if (m.balance > 0) {
    balLabel.textContent = 'Sobrou no Mês';
    balVal.style.color = 'var(--emerald)';
    balDot.style.background = 'var(--emerald)';
    balDot.style.boxShadow = '0 0 8px var(--emerald)';
    balFill.style.background = 'var(--emerald)';
    balFill.style.width = `${Math.min(100, Math.max(4, m.savingsPct))}%`;
    balMeta.textContent = `${m.savingsPct.toFixed(0)}% do salário preservado`;
  } else if (m.balance < 0) {
    balLabel.textContent = 'Faltou no Mês';
    balVal.style.color = 'var(--crimson)';
    balDot.style.background = 'var(--crimson)';
    balDot.style.boxShadow = '0 0 8px var(--crimson)';
    balFill.style.background = 'var(--crimson)';
    balFill.style.width = '100%';
    balMeta.textContent = 'Gastos superaram os ganhos';
  } else {
    balLabel.textContent = 'Saldo Restante';
    balVal.style.color = 'var(--text-primary)';
    balDot.style.background = 'var(--text-muted)';
    balDot.style.boxShadow = 'none';
    balFill.style.width = '0%';
    balMeta.textContent = 'Preencha seu salário e gastos';
  }
}

function renderOverviewTab(m, monthLabel) {
  const banner = document.getElementById('verdictBanner');
  const statusText = document.getElementById('verdictStatusText');
  const headline = document.getElementById('verdictHeadline');
  const subtext = document.getElementById('verdictSubtext');
  const balanceTitle = document.getElementById('balanceCardTitle');
  const balanceVal = document.getElementById('kpiBalanceValue');
  const balanceMeta = document.getElementById('kpiBalanceMeta');

  banner.classList.remove('status-positive', 'status-negative');

  if (m.totalIncome === 0 && m.totalOut === 0) {
    if (statusText) statusText.textContent = 'AGUARDANDO DADOS';
    headline.textContent = 'Configure seu salário para ver o balanço do mês';
    subtext.textContent = 'Abra a aba "Salário & Renda" na esquerda para definir quanto você ganha por mês.';
    balanceTitle.textContent = 'SALDO DO MÊS';
    balanceVal.textContent = formatBRL(0);
    balanceVal.style.color = 'var(--text-primary)';
  } else if (m.balance >= 0) {
    banner.classList.add('status-positive');
    if (statusText) statusText.textContent = 'NO AZUL · GANHOU MAIS DO QUE GASTOU';
    headline.textContent = `Você terminou ${monthLabel} com ${formatBRL(m.balance)} sobrando`;
    subtext.textContent = `Dos ${formatBRL(m.totalIncome)} recebidos, saíram ${formatBRL(m.totalFixed)} em assinaturas/fixos e ${formatBRL(m.totalVariable)} em outros gastos.`;
    balanceTitle.textContent = 'QUANTO SOBROU NO MÊS';
    balanceVal.textContent = formatBRL(m.balance);
    balanceVal.style.color = 'var(--emerald)';
  } else {
    banner.classList.add('status-negative');
    if (statusText) statusText.textContent = 'NO VERMELHO · GASTOU ACIMA DO SALÁRIO';
    headline.textContent = `Seus gastos passaram do salário em ${formatBRL(Math.abs(m.balance))}`;
    subtext.textContent = `Você recebeu ${formatBRL(m.totalIncome)}, mas gastou ${formatBRL(m.totalOut)} no total (${formatBRL(m.totalFixed)} fixos + ${formatBRL(m.totalVariable)} variáveis).`;
    balanceTitle.textContent = 'QUANTO FALTOU (DÉFICIT)';
    balanceVal.textContent = `- ${formatBRL(Math.abs(m.balance))}`;
    balanceVal.style.color = 'var(--crimson)';
  }

  balanceMeta.textContent = `Total de gastos: ${formatBRL(m.totalOut)}`;

  // Allocation bar
  const fixedBar = document.getElementById('barFixed');
  const varBar = document.getElementById('barVariable');
  const remBar = document.getElementById('barRemaining');
  const legendFixed = document.getElementById('legendFixedPct');
  const legendVar = document.getElementById('legendVariablePct');
  const legendRem = document.getElementById('legendRemainingPct');
  const legendRemLabel = document.getElementById('legendRemainingLabel');
  const legendRemSwatch = document.getElementById('legendRemainingSwatch');

  if (m.totalIncome > 0) {
    const fPct = (m.totalFixed / m.totalIncome) * 100;
    const vPct = (m.totalVariable / m.totalIncome) * 100;
    if (m.balance >= 0) {
      const rPct = Math.max(0, 100 - fPct - vPct);
      fixedBar.style.width = `${Math.min(100, fPct)}%`;
      varBar.style.width = `${Math.min(100 - Math.min(100, fPct), vPct)}%`;
      remBar.style.width = `${rPct}%`;
      remBar.classList.remove('is-deficit');
      legendRemSwatch.classList.remove('is-deficit');
      legendRemLabel.textContent = 'Livre';
      legendFixed.textContent = `${fPct.toFixed(0)}%`;
      legendVar.textContent = `${vPct.toFixed(0)}%`;
      legendRem.textContent = `${rPct.toFixed(0)}%`;
    } else {
      const tot = m.totalOut || 1;
      fixedBar.style.width = `${(m.totalFixed / tot) * 85}%`;
      varBar.style.width = `${(m.totalVariable / tot) * 85}%`;
      remBar.style.width = '15%';
      remBar.classList.add('is-deficit');
      legendRemSwatch.classList.add('is-deficit');
      legendRemLabel.textContent = 'Excedido';
      legendFixed.textContent = `${fPct.toFixed(0)}%`;
      legendVar.textContent = `${vPct.toFixed(0)}%`;
      legendRem.textContent = `${Math.abs(m.savingsPct).toFixed(0)}%`;
    }
  } else {
    fixedBar.style.width = '0%';
    varBar.style.width = '0%';
    remBar.style.width = '0%';
    legendFixed.textContent = '0%';
    legendVar.textContent = '0%';
    legendRem.textContent = '0%';
  }

  // 3 Summary Tiles
  document.getElementById('kpiSalaryValue').textContent = formatBRL(m.totalIncome);
  document.getElementById('kpiSalaryMeta').textContent =
    m.extraIncome > 0
      ? `Base ${formatBRL(m.baseSalary)} + Extra ${formatBRL(m.extraIncome)}`
      : 'Clique para configurar salário e renda';

  document.getElementById('kpiFixedValue').textContent = formatBRL(m.totalFixed);
  document.getElementById('kpiFixedCountBadge').textContent = `${m.activeFixedCount} ativos →`;
  document.getElementById('kpiFixedMeta').textContent =
    m.totalIncome > 0
      ? `Compromete ${((m.totalFixed / m.totalIncome) * 100).toFixed(1)}% do salário`
      : 'Assinaturas descontadas todo mês';

  document.getElementById('kpiVariableValue').textContent = formatBRL(m.totalVariable);
  document.getElementById('kpiVariableCountBadge').textContent = `${m.variableCount} itens →`;
  document.getElementById('kpiVariableMeta').textContent =
    m.totalIncome > 0
      ? `Consome ${((m.totalVariable / m.totalIncome) * 100).toFixed(1)}% do salário`
      : 'Gastos não fixos deste mês';

  // Fixed Subscriptions Preview Grid with Real Brand Logos
  const fixedPrevEl = document.getElementById('overviewFixedPreview');
  const activeFixed = state.fixedExpenses.filter((x) => x.active !== false);
  if (activeFixed.length === 0) {
    fixedPrevEl.innerHTML = `<div class="empty-state" style="grid-column:1/-1;padding:24px;">Nenhuma assinatura cadastrada ainda.</div>`;
  } else {
    fixedPrevEl.innerHTML = activeFixed
      .map(
        (item) => `
        <div class="mini-sub-card">
          ${renderBrandBoxHTML(item, 36)}
          <div class="mini-sub-info">
            <div class="mini-sub-name">${escapeHTML(item.name)}</div>
            <div class="mini-sub-meta">
              <span>${escapeHTML(item.method || 'Mensal')}</span>
              <strong class="mono" style="color:var(--text-primary)">${formatBRL(item.amount)}</strong>
            </div>
          </div>
        </div>
      `
      )
      .join('');
  }

  // Recent Variable Expenses Preview
  const varPrevEl = document.getElementById('overviewVariablePreview');
  const bucket = ensureMonthBucket(currentMonthKey);
  const recentVars = [...(bucket.variableExpenses || [])]
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, 5);

  if (recentVars.length === 0) {
    varPrevEl.innerHTML = `<div class="empty-state" style="padding:28px;">Nenhum gasto avulso registrado neste mês.</div>`;
  } else {
    varPrevEl.innerHTML = recentVars
      .map(
        (item) => `
        <div class="expense-item" style="padding: 11px 20px;">
          <div class="expense-left">
            ${renderBrandBoxHTML(item, 34)}
            <div class="expense-info">
              <div class="expense-title-line">
                <span class="expense-name">${escapeHTML(item.name)}</span>
              </div>
              <div class="expense-subline">
                <span>${escapeHTML(item.category)}</span>
                <span>·</span>
                <span class="mono">${formatDateBR(item.date)}</span>
              </div>
            </div>
          </div>
          <span class="expense-amount mono">${formatBRL(item.amount)}</span>
        </div>
      `
      )
      .join('');
  }
}

function renderSalaryTab(m) {
  const bucket = ensureMonthBucket(currentMonthKey);
  const salInput = document.getElementById('inlineSalaryInput');
  const extInput = document.getElementById('inlineExtraInput');
  const extNote = document.getElementById('inlineExtraNoteInput');
  const defCheck = document.getElementById('inlineSalaryDefaultCheck');

  if (document.activeElement !== salInput && document.activeElement !== extInput && document.activeElement !== extNote) {
    salInput.value = m.baseSalary > 0 ? m.baseSalary : '';
    extInput.value = m.extraIncome > 0 ? m.extraIncome : '';
    extNote.value = m.extraIncomeNote || '';
    defCheck.checked = bucket.salaryOverride === null;
  }

  document.getElementById('ledgerBaseSalary').textContent = `+ ${formatBRL(m.baseSalary)}`;
  const extraRow = document.getElementById('ledgerExtraRow');
  if (m.extraIncome > 0) {
    extraRow.style.display = 'flex';
    document.getElementById('ledgerExtraIncome').textContent = `+ ${formatBRL(m.extraIncome)}`;
  } else {
    extraRow.style.display = 'none';
  }
  document.getElementById('ledgerFixedOut').textContent = `- ${formatBRL(m.totalFixed)}`;
  document.getElementById('ledgerVariableOut').textContent = `- ${formatBRL(m.totalVariable)}`;

  const finalLabel = document.getElementById('ledgerFinalLabel');
  const finalBalance = document.getElementById('ledgerFinalBalance');
  if (m.balance >= 0) {
    finalLabel.textContent = 'Resultado Final (Sobrou)';
    finalBalance.textContent = `+ ${formatBRL(m.balance)}`;
    finalBalance.style.color = 'var(--emerald)';
  } else {
    finalLabel.textContent = 'Resultado Final (Faltou)';
    finalBalance.textContent = `- ${formatBRL(Math.abs(m.balance))}`;
    finalBalance.style.color = 'var(--crimson)';
  }

  updateSavingsSimulator(m);
}

function updateSavingsSimulator(m, source = 'init') {
  const slider = document.getElementById('simGoalSlider');
  const manualInput = document.getElementById('simManualGoalInput');
  const pctLabel = document.getElementById('simGoalPctLabel');
  const safeVarEl = document.getElementById('simSafeVarLimit');
  if (!slider || !manualInput || !pctLabel || !safeVarEl) return;

  let targetSave = 0;
  let pct = Number(slider.value) || 0;

  if (source === 'manual') {
    targetSave = Math.max(0, parseFloat(manualInput.value) || 0);
    pct = m.totalIncome > 0 ? Math.min(100, (targetSave / m.totalIncome) * 100) : 0;
    slider.value = Math.round(pct);
    pctLabel.textContent = `${pct.toFixed(1).replace('.0', '')}%`;
  } else {
    targetSave = m.totalIncome * (pct / 100);
    pctLabel.textContent = `${pct}%`;
    if (document.activeElement !== manualInput) {
      manualInput.value = targetSave > 0 ? targetSave.toFixed(2) : '';
    }
  }

  const safeVar = Math.max(0, m.totalIncome - m.totalFixed - targetSave);
  safeVarEl.textContent = formatBRL(safeVar);
}

function renderFixedTab(m) {
  document.getElementById('panelFixedTotal').textContent = formatBRL(m.totalFixed);

  const bucket = ensureMonthBucket(currentMonthKey);
  const paidSet = new Set(bucket.paidFixedIds || []);
  const sorted = [...state.fixedExpenses];

  const activeItems = sorted.filter((x) => x.active !== false);
  const paidCount = activeItems.filter((x) => paidSet.has(x.id)).length;
  document.getElementById('fixedPaidSummary').textContent = `${paidCount}/${activeItems.length} descontados neste mês`;

  // Main Fixed List
  const listEl = document.getElementById('fixedExpensesList');
  if (sorted.length === 0) {
    listEl.innerHTML = `<div class="empty-state">Nenhum gasto fixo ou assinatura cadastrada. Clique no botão "Adicionar Gasto Fixo" acima para adicionar!</div>`;
    return;
  }

  listEl.innerHTML = sorted
    .map((item) => {
      const isPaid = paidSet.has(item.id);
      const isActive = item.active !== false;

      return `
        <div class="expense-item ${!isActive ? 'is-paused' : ''}">
          <div class="expense-left">
            <button
              type="button"
              class="check-circle ${isPaid ? 'is-checked' : ''}"
              data-action="toggle-paid-fixed"
              data-id="${item.id}"
              title="${isPaid ? 'Desmarcar pagamento neste mês' : 'Marcar como já descontado neste mês'}"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
            ${renderBrandBoxHTML(item, 40)}
            <div class="expense-info">
              <div class="expense-title-line">
                <span class="expense-name">${escapeHTML(item.name)}</span>
                ${isPaid ? '<span class="tag-pill tag-pill-paid">Descontado</span>' : ''}
                ${!isActive ? '<span class="tag-pill">Pausado</span>' : ''}
              </div>
              <div class="expense-subline">
                <span>${escapeHTML(item.category || 'Assinatura')}</span>
                <span>·</span>
                <span>${escapeHTML(item.method || 'Cartão de Crédito (Fatura)')}</span>
                ${
                  item.note
                    ? `<span class="expense-note-chip">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        ${escapeHTML(item.note)}
                      </span>`
                    : ''
                }
              </div>
            </div>
          </div>

          <div class="expense-right">
            <span class="expense-amount mono">${formatBRL(item.amount)}</span>
            <div class="expense-actions">
              <button type="button" class="icon-btn" data-action="toggle-active-fixed" data-id="${item.id}" title="${isActive ? 'Pausar assinatura' : 'Reativar assinatura'}">
                ${
                  isActive
                    ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
                    : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>'
                }
              </button>
              <button type="button" class="icon-btn" data-action="edit-fixed" data-id="${item.id}" title="Editar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              </button>
              <button type="button" class="icon-btn action-btn-danger" data-action="delete-fixed" data-id="${item.id}" title="Excluir">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join('');
}

function renderVariableTab(m) {
  document.getElementById('panelVariableTotal').textContent = formatBRL(m.totalVariable);

  const listEl = document.getElementById('variableExpensesList');
  const searchQuery = (document.getElementById('variableSearchInput').value || '').trim().toLowerCase();
  const catFilter = document.getElementById('variableCategoryFilter').value;

  const bucket = ensureMonthBucket(currentMonthKey);
  const allItems = bucket.variableExpenses || [];

  const filtered = allItems
    .filter((item) => {
      if (catFilter !== 'all' && item.category !== catFilter) return false;
      if (!searchQuery) return true;
      const hay = `${item.name} ${item.category} ${item.method} ${item.note || ''}`.toLowerCase();
      return hay.includes(searchQuery);
    })
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="empty-state">Nenhum gasto não fixo encontrado neste mês. Clique no botão "Lançar Gasto" acima para adicionar!</div>`;
    return;
  }

  listEl.innerHTML = filtered
    .map(
      (item) => `
      <div class="expense-item">
        <div class="expense-left">
          ${renderBrandBoxHTML(item, 40)}
          <div class="expense-info">
            <div class="expense-title-line">
              <span class="expense-name">${escapeHTML(item.name)}</span>
              <span class="tag-pill">${escapeHTML(item.category || 'Outros')}</span>
            </div>
            <div class="expense-subline">
              <span class="mono">${formatDateBR(item.date)}</span>
              <span>·</span>
              <span>${escapeHTML(item.method || 'PIX')}</span>
              ${
                item.note
                  ? `<span class="expense-note-chip">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      ${escapeHTML(item.note)}
                    </span>`
                  : ''
              }
            </div>
          </div>
        </div>

        <div class="expense-right">
          <span class="expense-amount mono">${formatBRL(item.amount)}</span>
          <div class="expense-actions">
            <button type="button" class="icon-btn" data-action="edit-variable" data-id="${item.id}" title="Editar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </button>
            <button type="button" class="icon-btn action-btn-danger" data-action="delete-variable" data-id="${item.id}" title="Excluir">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    `
    )
    .join('');
}

function renderNotesTab() {
  const bucket = ensureMonthBucket(currentMonthKey);
  const notepadEl = document.getElementById('monthlyNotepad');
  if (document.activeElement !== notepadEl) {
    notepadEl.value = bucket.notepad || '';
  }

  const combined = [...(state.pinnedObservations || []), ...(bucket.observations || [])];
  const obsListEl = document.getElementById('observationsList');

  if (combined.length === 0) {
    obsListEl.innerHTML = `<div style="color:var(--text-muted);font-size:12.5px;padding:12px 0;">Nenhum lembrete cadastrado neste mês.</div>`;
  } else {
    obsListEl.innerHTML = combined
      .map((obs) => {
        const safeTag = ['Lembrete', 'Importante', 'Meta', 'Alerta'].includes(obs.tag) ? obs.tag : 'Lembrete';
        return `
          <div class="obs-card">
            <div>
              <div>
                <span class="obs-tag obs-tag-${safeTag}">${escapeHTML(safeTag)}</span>
                ${obs.pinned ? '<span style="font-size:11px;color:var(--text-muted);margin-left:6px;">· Fixada em todos os meses</span>' : ''}
              </div>
              <div class="obs-text">${escapeHTML(obs.text)}</div>
            </div>
            <button type="button" class="icon-btn action-btn-danger" data-action="delete-obs" data-id="${obs.id}" data-pinned="${obs.pinned ? '1' : '0'}" title="Remover">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        `;
      })
      .join('');
  }

  // Feed of expenses that have notes
  const feedEl = document.getElementById('expenseNotesFeed');
  const itemsWithNotes = [
    ...state.fixedExpenses.filter((x) => x.note && x.active !== false).map((x) => ({ ...x, isFixed: true })),
    ...(bucket.variableExpenses || []).filter((x) => x.note).map((x) => ({ ...x, isFixed: false }))
  ];

  if (itemsWithNotes.length === 0) {
    feedEl.innerHTML = `<div style="color:var(--text-muted);font-size:12.5px;">Nenhum gasto possui observação anotada neste mês.</div>`;
  } else {
    feedEl.innerHTML = itemsWithNotes
      .map(
        (item) => `
        <div class="obs-card" style="align-items:center;">
          <div style="display:flex;align-items:center;gap:10px;">
            ${renderBrandBoxHTML(item, 32)}
            <div>
              <div style="font-size:13px;font-weight:600;">${escapeHTML(item.name)} <span class="mono" style="color:var(--text-secondary)">(${formatBRL(item.amount)})</span></div>
              <div style="font-size:12px;color:var(--cyan);">${escapeHTML(item.note)}</div>
            </div>
          </div>
          <span class="tag-pill">${item.isFixed ? 'Fixo' : 'Mês'}</span>
        </div>
      `
      )
      .join('');
  }
}

function renderAnnualTab() {
  document.getElementById('annualYearTitle').textContent = selectedYear;
  document.getElementById('yearSwitcherLabel').textContent = selectedYear;

  let yearIncome = 0;
  let yearFixed = 0;
  let yearVar = 0;
  let maxBarVal = 1;

  const monthsData = [];

  for (let m = 1; m <= 12; m++) {
    const mKey = `${selectedYear}-${String(m).padStart(2, '0')}`;
    const metrics = computeMonthMetrics(mKey);
    monthsData.push({ mIndex: m - 1, monthKey: mKey, metrics });

    yearIncome += metrics.totalIncome;
    yearFixed += metrics.totalFixed;
    yearVar += metrics.totalVariable;
    maxBarVal = Math.max(maxBarVal, metrics.totalIncome, metrics.totalFixed + metrics.totalVariable);
  }

  const yearBalance = yearIncome - (yearFixed + yearVar);

  document.getElementById('annualTotalIncome').textContent = formatBRL(yearIncome);
  document.getElementById('annualTotalFixed').textContent = formatBRL(yearFixed);
  document.getElementById('annualTotalVariable').textContent = formatBRL(yearVar);

  const annualBalEl = document.getElementById('annualTotalBalance');
  annualBalEl.textContent = formatBRL(yearBalance);
  annualBalEl.style.color = yearBalance >= 0 ? 'var(--emerald)' : 'var(--crimson)';
  document.getElementById('annualBalanceSub').textContent =
    yearBalance >= 0 ? 'Acumulado positivo no ano' : 'Acumulado negativo no ano';

  // Render 12-month interactive bar chart
  const barsStage = document.getElementById('annualBarsStage');
  barsStage.innerHTML = monthsData
    .map(({ mIndex, monthKey, metrics }) => {
      const incH = Math.max(4, Math.round((metrics.totalIncome / maxBarVal) * 140));
      const fixH = Math.max(4, Math.round((metrics.totalFixed / maxBarVal) * 140));
      const varH = Math.max(4, Math.round((metrics.totalVariable / maxBarVal) * 140));
      const isCurr = monthKey === currentMonthKey;

      return `
        <div class="month-bar-col ${isCurr ? 'is-current-month' : ''}" data-select-month="${monthKey}" title="${MONTH_NAMES[mIndex]} ${selectedYear}: Sobrou ${formatBRL(metrics.balance)}">
          <div class="month-bar-group">
            <div class="m-bar m-bar-income" style="height:${incH}px"></div>
            <div class="m-bar m-bar-fixed" style="height:${fixH}px"></div>
            <div class="m-bar m-bar-var" style="height:${varH}px"></div>
          </div>
          <span class="month-bar-name">${MONTH_SHORT[mIndex]}</span>
        </div>
      `;
    })
    .join('');

  // Render 12 Month Cards
  const gridEl = document.getElementById('annualMonthsGrid');
  gridEl.innerHTML = monthsData
    .map(({ mIndex, monthKey, metrics }) => {
      const isSelected = monthKey === currentMonthKey;
      const isPos = metrics.balance >= 0;

      return `
        <div class="annual-month-card ${isSelected ? 'is-selected' : ''}" data-select-month="${monthKey}">
          <div class="amc-head">
            <span class="amc-title">${MONTH_NAMES[mIndex]}</span>
            <span class="amc-pill mono" style="background:${isPos ? 'var(--emerald-soft)' : 'var(--crimson-soft)'};color:${isPos ? 'var(--emerald)' : 'var(--crimson)'}">
              ${isPos ? 'Sobrou' : 'Faltou'} ${formatCompactBRL(Math.abs(metrics.balance))}
            </span>
          </div>
          <div class="amc-rows">
            <div class="amc-row"><span>Salário/Renda:</span><strong class="mono text-emerald">${formatBRL(metrics.totalIncome)}</strong></div>
            <div class="amc-row"><span>Gastos Fixos:</span><strong class="mono text-violet">${formatBRL(metrics.totalFixed)}</strong></div>
            <div class="amc-row"><span>Não Fixos:</span><strong class="mono text-amber">${formatBRL(metrics.totalVariable)}</strong></div>
          </div>
        </div>
      `;
    })
    .join('');
}

// ============================================================================
// PRESETS & ICON PICKERS INITIALIZATION
// ============================================================================
function normalizeSearchText(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function initPresetsAndPickers() {
  // Modal Visual Pickers with searchable metadata
  const allPickerHTML = Object.entries(ICON_CATALOG)
    .map(([key, def]) => {
      const searchTerms = normalizeSearchText(
        `${def.label} ${def.defaultCategory || ''} ${(def.keywords || []).join(' ')}`
      );
      return `
      <button type="button" class="icon-pick-btn" data-pick-key="${key}" data-search="${escapeHTML(searchTerms)}">
        <span class="pick-glyph" style="background:${def.bg};color:${def.color}">${def.svg}</span>
        <span>${escapeHTML(def.label)}</span>
      </button>
    `;
    })
    .join('');

  document.getElementById('fixedModalIconPicker').innerHTML = allPickerHTML;
  document.getElementById('variableModalIconPicker').innerHTML = allPickerHTML;
}

function filterIconPicker(containerId, query) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const q = normalizeSearchText(query);
  container.querySelectorAll('.icon-pick-btn').forEach((btn) => {
    const hay = btn.getAttribute('data-search') || '';
    const match = !q || hay.includes(q);
    btn.style.display = match ? '' : 'none';
  });
}

function highlightModalPicker(containerId, selectedKey) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.querySelectorAll('.icon-pick-btn').forEach((btn) => {
    btn.classList.toggle('is-selected', btn.getAttribute('data-pick-key') === selectedKey);
  });
}

// ============================================================================
// MODALS
// ============================================================================
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('is-open');
  el.setAttribute('aria-hidden', 'false');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('is-open');
  el.setAttribute('aria-hidden', 'true');
}

function openFixedExpenseModal(editId = null, preset = null) {
  const form = document.getElementById('fixedExpenseForm');
  form.reset();
  document.getElementById('fixedExpenseId').value = '';
  document.getElementById('fixedIconKeyInput').value = '';
  const searchInput = document.getElementById('fixedIconSearchInput');
  if (searchInput) searchInput.value = '';
  filterIconPicker('fixedModalIconPicker', '');

  if (editId) {
    const item = state.fixedExpenses.find((x) => x.id === editId);
    if (item) {
      document.getElementById('fixedModalTitle').textContent = 'Editar Gasto Fixo / Assinatura';
      document.getElementById('fixedExpenseId').value = item.id;
      document.getElementById('fixedNameInput').value = item.name;
      document.getElementById('fixedAmountInput').value = item.amount;
      document.getElementById('fixedCategoryInput').value = item.category || 'Assinatura / Streaming';
      document.getElementById('fixedMethodInput').value = item.method || 'Cartão de Crédito (Fatura)';
      document.getElementById('fixedNoteInput').value = item.note || '';
      const resolved = resolveExpenseVisual(item);
      document.getElementById('fixedIconKeyInput').value = resolved.key;
      highlightModalPicker('fixedModalIconPicker', resolved.key);
    }
  } else if (preset) {
    document.getElementById('fixedModalTitle').textContent = `Adicionar ${preset.name}`;
    document.getElementById('fixedNameInput').value = preset.name;
    document.getElementById('fixedCategoryInput').value = preset.cat || 'Assinatura / Streaming';
    document.getElementById('fixedIconKeyInput').value = preset.key;
    highlightModalPicker('fixedModalIconPicker', preset.key);
  } else {
    document.getElementById('fixedModalTitle').textContent = 'Novo Gasto Fixo / Assinatura';
    highlightModalPicker('fixedModalIconPicker', 'spotify');
  }

  openModal('fixedExpenseModal');
  setTimeout(() => {
    const focusTarget = preset ? document.getElementById('fixedAmountInput') : document.getElementById('fixedNameInput');
    focusTarget.focus();
  }, 50);
}

function openVariableExpenseModal(editId = null) {
  const form = document.getElementById('variableExpenseForm');
  form.reset();
  document.getElementById('variableExpenseId').value = '';
  document.getElementById('variableIconKeyInput').value = '';
  const searchInput = document.getElementById('variableIconSearchInput');
  if (searchInput) searchInput.value = '';
  filterIconPicker('variableModalIconPicker', '');

  const bucket = ensureMonthBucket(currentMonthKey);

  if (editId) {
    const item = (bucket.variableExpenses || []).find((x) => x.id === editId);
    if (item) {
      document.getElementById('variableModalTitle').textContent = 'Editar Gasto do Mês';
      document.getElementById('variableExpenseId').value = item.id;
      document.getElementById('variableNameInput').value = item.name;
      document.getElementById('variableAmountInput').value = item.amount;
      document.getElementById('variableDateInput').value = item.date;
      document.getElementById('variableCategoryInput').value = item.category || 'Alimentação';
      document.getElementById('variableMethodInput').value = item.method || 'PIX';
      document.getElementById('variableNoteInput').value = item.note || '';
      const resolved = resolveExpenseVisual(item);
      document.getElementById('variableIconKeyInput').value = resolved.key;
      highlightModalPicker('variableModalIconPicker', resolved.key);
    }
  } else {
    document.getElementById('variableModalTitle').textContent = 'Lançar Gasto do Mês';
    const todayISO = getTodayISO();
    document.getElementById('variableDateInput').value = todayISO.startsWith(currentMonthKey) ? todayISO : `${currentMonthKey}-01`;
    highlightModalPicker('variableModalIconPicker', 'fuel');
  }

  openModal('variableExpenseModal');
}

function changeMonth(delta) {
  const [y, m] = currentMonthKey.split('-').map(Number);
  const next = new Date(y, m - 1 + delta, 1);
  currentMonthKey = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
  selectedYear = next.getFullYear();
  renderAll();
}

// ============================================================================
// GOOGLE AUTHENTICATION & MULTI-ACCOUNT SYSTEM
// ============================================================================
function decodeGoogleJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function renderSidebarUserCard() {
  const nameEl = document.getElementById('sidebarUserName');
  const emailEl = document.getElementById('sidebarUserEmail');
  const avatarEl = document.getElementById('sidebarUserAvatar');
  if (!nameEl || !emailEl || !avatarEl) return;

  if (!currentUser) {
    nameEl.textContent = 'Não conectado';
    emailEl.textContent = 'Faça login com o Google';
    avatarEl.innerHTML = 'G';
    return;
  }

  nameEl.textContent = currentUser.name || 'Usuário';
  emailEl.textContent = currentUser.email || '';

  if (currentUser.picture) {
    avatarEl.innerHTML = `<img src="${escapeHTML(currentUser.picture)}" alt="${escapeHTML(currentUser.name)}" referrerpolicy="no-referrer" />`;
  } else {
    const initial = (currentUser.name || currentUser.email || 'U').trim().charAt(0).toUpperCase();
    avatarEl.innerHTML = escapeHTML(initial);
  }
}

async function completeUserLogin(account) {
  const cleanUser = {
    name: String(account.name || '').trim() || account.email.split('@')[0],
    email: String(account.email || '').trim().toLowerCase(),
    picture: account.picture || ''
  };

  currentUser = cleanUser;
  localStorage.setItem(AUTH_CURRENT_USER_KEY, JSON.stringify(cleanUser));
  saveAccountToRegistry({
    ...cleanUser,
    pinHash: account.pinHash || ''
  });

  // Hide login overlay
  const overlay = document.getElementById('authOverlay');
  if (overlay) {
    overlay.classList.add('is-hidden');
    overlay.setAttribute('aria-hidden', 'true');
  }

  // Load this user's isolated state and sync with SQLite / IndexedDB
  state = loadState();
  renderSidebarUserCard();
  renderAll();
  await initSQLiteDatabase();
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem(AUTH_CURRENT_USER_KEY);
  renderSidebarUserCard();
  showAuthOverlay();
}

function showAuthOverlay(forceForm = false) {
  const overlay = document.getElementById('authOverlay');
  if (!overlay) return;
  overlay.classList.remove('is-hidden');
  overlay.setAttribute('aria-hidden', 'false');

  const errEl = document.getElementById('authErrorMsg');
  if (errEl) errEl.style.display = 'none';

  const savedAccounts = getSavedAccounts();
  const savedSection = document.getElementById('savedAccountsSection');
  const savedList = document.getElementById('savedAccountsList');
  const loginForm = document.getElementById('googleLoginForm');
  const backBtn = document.getElementById('backToSavedAccountsBtn');

  if (savedAccounts.length > 0 && !forceForm) {
    savedSection.style.display = 'flex';
    loginForm.style.display = 'none';
    backBtn.style.display = 'inline-flex';

    savedList.innerHTML = savedAccounts
      .map((acc) => {
        const initial = (acc.name || acc.email || 'G').trim().charAt(0).toUpperCase();
        const avatarHTML = acc.picture
          ? `<img src="${escapeHTML(acc.picture)}" alt="" referrerpolicy="no-referrer" />`
          : escapeHTML(initial);

        return `
          <div class="saved-account-item" data-login-email="${escapeHTML(acc.email)}">
            <div class="saved-account-left">
              <div class="user-avatar">${avatarHTML}</div>
              <div class="saved-account-info">
                <span class="saved-account-name">${escapeHTML(acc.name)}</span>
                <span class="saved-account-email">${escapeHTML(acc.email)}${acc.pinHash ? ' · 🔒 Com senha' : ''}</span>
              </div>
            </div>
            <button type="button" class="saved-account-remove" data-remove-account="${escapeHTML(acc.email)}" title="Remover conta da lista">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        `;
      })
      .join('');
  } else {
    savedSection.style.display = 'none';
    loginForm.style.display = 'flex';
    backBtn.style.display = savedAccounts.length > 0 ? 'inline-flex' : 'none';
  }
}

function initGoogleIdentityServices() {
  const clientId = (localStorage.getItem(GOOGLE_CLIENT_ID_KEY) || '').trim();
  const gsiWrapper = document.getElementById('googleGsiWrapper');
  const gsiContainer = document.getElementById('googleGsiButtonContainer');
  const clientIdInput = document.getElementById('googleClientIdInput');
  if (clientIdInput && clientId) {
    clientIdInput.value = clientId;
  }

  if (!clientId || !gsiWrapper || !gsiContainer) {
    if (gsiWrapper) gsiWrapper.style.display = 'none';
    return;
  }

  const tryRenderGsi = () => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          const payload = decodeGoogleJwt(response.credential);
          if (payload && payload.email) {
            completeUserLogin({
              name: payload.name || payload.given_name || payload.email.split('@')[0],
              email: payload.email,
              picture: payload.picture || ''
            });
          }
        }
      });
      gsiWrapper.style.display = 'flex';
      gsiContainer.innerHTML = '';
      window.google.accounts.id.renderButton(gsiContainer, {
        theme: 'filled_black',
        size: 'large',
        shape: 'pill',
        text: 'continue_with',
        width: 340
      });
    } else {
      setTimeout(tryRenderGsi, 400);
    }
  };

  tryRenderGsi();
}

function initAuthFlow() {
  renderSidebarUserCard();
  initGoogleIdentityServices();

  if (currentUser && currentUser.email) {
    const overlay = document.getElementById('authOverlay');
    if (overlay) {
      overlay.classList.add('is-hidden');
      overlay.setAttribute('aria-hidden', 'true');
    }
  } else {
    showAuthOverlay(false);
  }
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initPresetsAndPickers();
  initAuthFlow();
  renderAll();
  if (currentUser && currentUser.email) {
    initSQLiteDatabase();
  }

  // Auth & Account Switcher Events
  const googleLoginForm = document.getElementById('googleLoginForm');
  if (googleLoginForm) {
    googleLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('authNameInput').value.trim();
      const email = document.getElementById('authEmailInput').value.trim().toLowerCase();
      const pin = document.getElementById('authPinInput').value;
      const errEl = document.getElementById('authErrorMsg');

      if (!name || !email || !email.includes('@')) {
        errEl.textContent = 'Preencha seu nome e um e-mail Google válido.';
        errEl.style.display = 'block';
        return;
      }

      const existing = getSavedAccounts().find((a) => a.email.toLowerCase() === email);
      if (existing && existing.pinHash && existing.pinHash !== pin) {
        errEl.textContent = 'Senha / PIN incorreto para esta conta.';
        errEl.style.display = 'block';
        return;
      }

      errEl.style.display = 'none';
      googleLoginForm.reset();
      completeUserLogin({
        name,
        email,
        picture: existing ? existing.picture || '' : '',
        pinHash: pin || (existing ? existing.pinHash || '' : '')
      });
    });
  }

  const savedAccountsList = document.getElementById('savedAccountsList');
  if (savedAccountsList) {
    savedAccountsList.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('[data-remove-account]');
      if (removeBtn) {
        e.stopPropagation();
        const emailToRemove = removeBtn.getAttribute('data-remove-account');
        const updated = getSavedAccounts().filter((a) => a.email.toLowerCase() !== emailToRemove.toLowerCase());
        localStorage.setItem(AUTH_SAVED_ACCOUNTS_KEY, JSON.stringify(updated));
        showAuthOverlay(false);
        return;
      }

      const item = e.target.closest('[data-login-email]');
      if (!item) return;
      const email = item.getAttribute('data-login-email');
      const acc = getSavedAccounts().find((a) => a.email.toLowerCase() === email.toLowerCase());
      if (!acc) return;

      if (acc.pinHash) {
        const enteredPin = prompt(`Digite a senha / PIN da conta de ${acc.name} (${acc.email}):`);
        if (enteredPin === null) return;
        if (enteredPin !== acc.pinHash) {
          alert('Senha / PIN incorreto.');
          return;
        }
      }

      completeUserLogin(acc);
    });
  }

  const useAnotherBtn = document.getElementById('useAnotherAccountBtn');
  if (useAnotherBtn) {
    useAnotherBtn.addEventListener('click', () => showAuthOverlay(true));
  }

  const backToSavedBtn = document.getElementById('backToSavedAccountsBtn');
  if (backToSavedBtn) {
    backToSavedBtn.addEventListener('click', () => showAuthOverlay(false));
  }

  const logoutBtn = document.getElementById('logoutUserBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => logoutUser());
  }

  const toggleOauthBtn = document.getElementById('toggleOauthConfigBtn');
  if (toggleOauthBtn) {
    toggleOauthBtn.addEventListener('click', () => {
      const box = document.getElementById('oauthConfigBox');
      if (box) box.style.display = box.style.display === 'none' ? 'flex' : 'none';
    });
  }

  const saveClientIdBtn = document.getElementById('saveGoogleClientIdBtn');
  if (saveClientIdBtn) {
    saveClientIdBtn.addEventListener('click', () => {
      const val = (document.getElementById('googleClientIdInput').value || '').trim();
      localStorage.setItem(GOOGLE_CLIENT_ID_KEY, val);
      initGoogleIdentityServices();
      alert(val ? 'Google Client ID salvo! O botão oficial do Google foi ativado.' : 'Google Client ID removido.');
    });
  }

  // Left Sidebar Tabs
  document.querySelectorAll('.nav-tab').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
  });

  // Jump-to-tab buttons in Overview
  document.querySelectorAll('[data-jump-tab]').forEach((el) => {
    el.addEventListener('click', () => switchTab(el.getAttribute('data-jump-tab')));
  });

  // Month Navigation
  document.getElementById('prevMonthBtn').addEventListener('click', () => changeMonth(-1));
  document.getElementById('nextMonthBtn').addEventListener('click', () => changeMonth(1));
  document.getElementById('currentMonthTrigger').addEventListener('click', () => {
    currentMonthKey = getTodayMonthKey();
    selectedYear = Number(currentMonthKey.split('-')[0]);
    renderAll();
  });

  // Year Navigation in Annual View
  document.getElementById('prevYearBtn').addEventListener('click', () => {
    selectedYear -= 1;
    renderAnnualTab();
  });
  document.getElementById('nextYearBtn').addEventListener('click', () => {
    selectedYear += 1;
    renderAnnualTab();
  });

  // Click on any month in Annual View to jump to that month
  document.getElementById('tab-annual').addEventListener('click', (e) => {
    const monthTarget = e.target.closest('[data-select-month]');
    if (!monthTarget) return;
    currentMonthKey = monthTarget.getAttribute('data-select-month');
    switchTab('overview');
  });

  // Open Modals Buttons
  document.getElementById('overviewAddFixedBtn').addEventListener('click', () => openFixedExpenseModal());
  document.getElementById('overviewAddVarBtn').addEventListener('click', () => openVariableExpenseModal());
  document.getElementById('openFixedModalBtn').addEventListener('click', () => openFixedExpenseModal());
  document.getElementById('openVariableModalBtn').addEventListener('click', () => openVariableExpenseModal());

  // Close Modals
  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => closeModal(btn.getAttribute('data-close-modal')));
  });
  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal(backdrop.id);
    });
  });

  // Search inputs inside Modal Topic/Icon Pickers
  const fixedIconSearch = document.getElementById('fixedIconSearchInput');
  if (fixedIconSearch) {
    fixedIconSearch.addEventListener('input', (e) => {
      filterIconPicker('fixedModalIconPicker', e.target.value);
    });
  }

  const varIconSearch = document.getElementById('variableIconSearchInput');
  if (varIconSearch) {
    varIconSearch.addEventListener('input', (e) => {
      filterIconPicker('variableModalIconPicker', e.target.value);
    });
  }

  const catalogLabels = new Set(Object.values(ICON_CATALOG).map((d) => d.label));

  // Modal Icon Picker Clicks
  document.getElementById('fixedModalIconPicker').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-pick-key]');
    if (!btn) return;
    const key = btn.getAttribute('data-pick-key');
    const def = ICON_CATALOG[key];
    document.getElementById('fixedIconKeyInput').value = key;
    highlightModalPicker('fixedModalIconPicker', key);
    const nameField = document.getElementById('fixedNameInput');
    if (!nameField.value.trim() || catalogLabels.has(nameField.value.trim())) {
      nameField.value = def.label;
    }
    if (def.defaultCategory) {
      const catSelect = document.getElementById('fixedCategoryInput');
      if ([...catSelect.options].some((o) => o.value === def.defaultCategory)) {
        catSelect.value = def.defaultCategory;
      }
    }
  });

  document.getElementById('variableModalIconPicker').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-pick-key]');
    if (!btn) return;
    const key = btn.getAttribute('data-pick-key');
    const def = ICON_CATALOG[key];
    document.getElementById('variableIconKeyInput').value = key;
    highlightModalPicker('variableModalIconPicker', key);
    const nameField = document.getElementById('variableNameInput');
    if (!nameField.value.trim() || catalogLabels.has(nameField.value.trim())) {
      nameField.value = def.label;
    }
    if (def.defaultCategory) {
      const catSelect = document.getElementById('variableCategoryInput');
      if ([...catSelect.options].some((o) => o.value === def.defaultCategory)) {
        catSelect.value = def.defaultCategory;
      }
    }
  });

  // Auto-detect icon when typing inside Fixed Modal
  document.getElementById('fixedNameInput').addEventListener('input', (e) => {
    const detected = resolveExpenseVisual({ name: e.target.value });
    document.getElementById('fixedIconKeyInput').value = detected.key;
    highlightModalPicker('fixedModalIconPicker', detected.key);
  });

  // Auto-detect icon when typing inside Variable Modal
  document.getElementById('variableNameInput').addEventListener('input', (e) => {
    const detected = resolveExpenseVisual({ name: e.target.value });
    document.getElementById('variableIconKeyInput').value = detected.key;
    highlightModalPicker('variableModalIconPicker', detected.key);
  });

  // Salary Tab Quick Buttons & Form
  document.querySelectorAll('[data-set-salary]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.getElementById('inlineSalaryInput').value = btn.getAttribute('data-set-salary');
    });
  });

  document.getElementById('inlineSalaryForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const sal = parseFloat(document.getElementById('inlineSalaryInput').value) || 0;
    const isDef = document.getElementById('inlineSalaryDefaultCheck').checked;
    const extra = parseFloat(document.getElementById('inlineExtraInput').value) || 0;
    const note = document.getElementById('inlineExtraNoteInput').value.trim();

    const bucket = ensureMonthBucket(currentMonthKey);
    if (isDef) {
      state.defaultSalary = sal;
      bucket.salaryOverride = null;
    } else {
      bucket.salaryOverride = sal;
    }
    bucket.extraIncome = extra;
    bucket.extraIncomeNote = note;

    saveState();
    renderAll();

    const toast = document.getElementById('salarySavedFeedback');
    toast.classList.add('is-visible');
    setTimeout(() => toast.classList.remove('is-visible'), 2000);
  });

  document.getElementById('simGoalSlider').addEventListener('input', () => {
    updateSavingsSimulator(computeMonthMetrics(currentMonthKey), 'slider');
  });

  const simManualGoalInput = document.getElementById('simManualGoalInput');
  if (simManualGoalInput) {
    simManualGoalInput.addEventListener('input', () => {
      updateSavingsSimulator(computeMonthMetrics(currentMonthKey), 'manual');
    });
  }

  // Save Fixed Expense Modal
  document.getElementById('fixedExpenseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('fixedExpenseId').value;
    const name = document.getElementById('fixedNameInput').value.trim();
    const amount = parseFloat(document.getElementById('fixedAmountInput').value) || 0;
    const category = document.getElementById('fixedCategoryInput').value;
    const method = document.getElementById('fixedMethodInput').value;
    const note = document.getElementById('fixedNoteInput').value.trim();
    const iconKey = document.getElementById('fixedIconKeyInput').value || resolveExpenseVisual({ name, category }).key;

    if (!name || amount <= 0) return;

    if (id) {
      const idx = state.fixedExpenses.findIndex((x) => x.id === id);
      if (idx !== -1) {
        state.fixedExpenses[idx] = { ...state.fixedExpenses[idx], name, amount, category, method, note, iconKey };
      }
    } else {
      state.fixedExpenses.push({ id: uid(), name, amount, category, method, note, iconKey, active: true });
    }

    saveState();
    closeModal('fixedExpenseModal');
    renderAll();
  });

  // Save Variable Expense Modal
  document.getElementById('variableExpenseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('variableExpenseId').value;
    const name = document.getElementById('variableNameInput').value.trim();
    const amount = parseFloat(document.getElementById('variableAmountInput').value) || 0;
    const date = document.getElementById('variableDateInput').value;
    const category = document.getElementById('variableCategoryInput').value;
    const method = document.getElementById('variableMethodInput').value;
    const note = document.getElementById('variableNoteInput').value.trim();
    const iconKey = document.getElementById('variableIconKeyInput').value || resolveExpenseVisual({ name, category }).key;

    if (!name || amount <= 0) return;

    const bucket = ensureMonthBucket(currentMonthKey);
    if (id) {
      const idx = bucket.variableExpenses.findIndex((x) => x.id === id);
      if (idx !== -1) {
        bucket.variableExpenses[idx] = { id, name, amount, date, category, method, note, iconKey };
      }
    } else {
      bucket.variableExpenses.push({ id: uid(), name, amount, date, category, method, note, iconKey });
    }

    saveState();
    closeModal('variableExpenseModal');
    renderAll();
  });

  // Fixed Expenses List Actions
  document.getElementById('fixedExpensesList').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    const id = btn.getAttribute('data-id');
    const bucket = ensureMonthBucket(currentMonthKey);

    if (action === 'toggle-paid-fixed') {
      const set = new Set(bucket.paidFixedIds || []);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      bucket.paidFixedIds = Array.from(set);
      saveState();
      renderAll();
    } else if (action === 'toggle-active-fixed') {
      const item = state.fixedExpenses.find((x) => x.id === id);
      if (item) {
        item.active = item.active === false ? true : false;
        saveState();
        renderAll();
      }
    } else if (action === 'edit-fixed') {
      openFixedExpenseModal(id);
    } else if (action === 'delete-fixed') {
      state.fixedExpenses = state.fixedExpenses.filter((x) => x.id !== id);
      saveState();
      renderAll();
    }
  });

  // Variable Expenses List Actions
  document.getElementById('variableExpensesList').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    const id = btn.getAttribute('data-id');
    const bucket = ensureMonthBucket(currentMonthKey);

    if (action === 'edit-variable') {
      openVariableExpenseModal(id);
    } else if (action === 'delete-variable') {
      bucket.variableExpenses = (bucket.variableExpenses || []).filter((x) => x.id !== id);
      saveState();
      renderAll();
    }
  });

  document.getElementById('variableSearchInput').addEventListener('input', () => renderVariableTab(computeMonthMetrics(currentMonthKey)));
  document.getElementById('variableCategoryFilter').addEventListener('change', () => renderVariableTab(computeMonthMetrics(currentMonthKey)));

  // Notepad & Observations
  let notepadTimer = null;
  document.getElementById('monthlyNotepad').addEventListener('input', (e) => {
    const status = document.getElementById('notepadSaveStatus');
    status.textContent = 'Salvando...';
    const bucket = ensureMonthBucket(currentMonthKey);
    bucket.notepad = e.target.value;
    saveState();
    clearTimeout(notepadTimer);
    notepadTimer = setTimeout(() => {
      status.textContent = 'Salvo automaticamente';
    }, 500);
  });

  document.getElementById('addObservationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const tag = document.getElementById('obsTagSelect').value;
    const input = document.getElementById('obsTextInput');
    const pinned = document.getElementById('obsPinAllMonths').checked;
    const text = input.value.trim();
    if (!text) return;

    const obs = { id: uid(), tag, text, pinned, createdAt: currentMonthKey };
    if (pinned) {
      state.pinnedObservations.unshift(obs);
    } else {
      ensureMonthBucket(currentMonthKey).observations.unshift(obs);
    }
    input.value = '';
    document.getElementById('obsPinAllMonths').checked = false;
    saveState();
    renderAll();
  });

  document.getElementById('observationsList').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="delete-obs"]');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const pinned = btn.getAttribute('data-pinned') === '1';
    if (pinned) {
      state.pinnedObservations = state.pinnedObservations.filter((x) => x.id !== id);
    } else {
      const bucket = ensureMonthBucket(currentMonthKey);
      bucket.observations = (bucket.observations || []).filter((x) => x.id !== id);
    }
    saveState();
    renderAll();
  });

  // Backup Export / Import / Reset
  document.getElementById('exportDataBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meu-caixa-backup-${currentMonthKey}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('importDataInput').addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        state = {
          defaultSalary: Number(parsed.defaultSalary) || 0,
          fixedExpenses: Array.isArray(parsed.fixedExpenses) ? parsed.fixedExpenses : [],
          pinnedObservations: Array.isArray(parsed.pinnedObservations) ? parsed.pinnedObservations : [],
          months: parsed.months && typeof parsed.months === 'object' ? parsed.months : {}
        };
        saveState();
        renderAll();
      } catch (err) {
        alert('Arquivo inválido.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  document.getElementById('resetAllDataBtn').addEventListener('click', () => {
    if (confirm('Deseja zerar todos os lançamentos e começar em branco?')) {
      state = { defaultSalary: 0, fixedExpenses: [], pinnedObservations: [], months: {} };
      saveState();
      renderAll();
    }
  });
});
