// URL do seu Web App publicado no Google Apps Script.
// Troque aqui caso publique uma nova versão do script.
export const API_URL =
  "https://script.google.com/macros/s/AKfycbzu7I1_K2_LrOZu-q0Pv9x0l-Oxskn-stAEQFJ-sLp0AzYOFbxxNDSKG3iyLLQTbhiP/exec"

export const VAGAS_TOTAIS = 5

export type Lead = {
  id: number
  quadro: string
  cliques: number
}

export type LiberacaoResposta = {
  // O Apps Script deve retornar o telefone/WhatsApp neste campo
  // após registrar o clique. Aceitamos algumas variações de nome.
  telefone?: string
  whatsapp?: string
  contato?: string
  sucesso?: boolean
  erro?: string
}

export async function carregarLeads(): Promise<Lead[]> {
  const resposta = await fetch(API_URL, { cache: "no-store" })
  if (!resposta.ok) {
    throw new Error("Falha ao carregar oportunidades")
  }
  const dados = await resposta.json()
  return Array.isArray(dados) ? dados : []
}

export async function liberarContato(rowId: number): Promise<LiberacaoResposta> {
  const resposta = await fetch(API_URL, {
    method: "POST",
    // text/plain evita o preflight de CORS bloqueado pelo Apps Script
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ rowId }),
  })

  // Tentamos ler a resposta como JSON (caso o script retorne o telefone).
  // Se o script ainda não retornar nada, seguimos sem o número.
  try {
    const texto = await resposta.text()
    return texto ? (JSON.parse(texto) as LiberacaoResposta) : {}
  } catch {
    return {}
  }
}

export function extrairTelefone(resposta: LiberacaoResposta): string | null {
  const valor = resposta.telefone || resposta.whatsapp || resposta.contato
  return valor ? String(valor).trim() : null
}

export function linkWhatsApp(telefone: string): string {
  const apenasNumeros = telefone.replace(/\D/g, "")
  const comDDI = apenasNumeros.startsWith("55") ? apenasNumeros : `55${apenasNumeros}`
  return `https://wa.me/${comDDI}`
}
