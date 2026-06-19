"use client"

import { useState } from "react"
import {
  Flame,
  Loader2,
  Phone,
  MessageCircle,
  Copy,
  Check,
  ClipboardList,
} from "lucide-react"
import {
  type Lead,
  VAGAS_TOTAIS,
  liberarContato,
  extrairTelefone,
  linkWhatsApp,
} from "@/lib/leads"

type Estado = "inicial" | "carregando" | "revelado" | "erro"

export function OpportunityCard({ lead }: { lead: Lead }) {
  const [estado, setEstado] = useState<Estado>("inicial")
  const [telefone, setTelefone] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)

  const vagasRestantes = Math.max(VAGAS_TOTAIS - lead.cliques, 0)
  const esgotado = vagasRestantes <= 0

  async function handleLiberar() {
    setEstado("carregando")
    try {
      const resposta = await liberarContato(lead.id)
      setTelefone(extrairTelefone(resposta))
      setEstado("revelado")
    } catch {
      setEstado("erro")
    }
  }

  async function handleCopiar() {
    if (!telefone) return
    await navigator.clipboard.writeText(telefone)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      <div
        className={`mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
          esgotado
            ? "bg-muted text-muted-foreground"
            : "bg-warning/10 text-warning"
        }`}
      >
        <Flame className="h-3.5 w-3.5" aria-hidden="true" />
        {esgotado
          ? "Vagas esgotadas para este orçamento"
          : `Restam ${vagasRestantes} de ${VAGAS_TOTAIS} vagas`}
      </div>

      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Necessidade do paciente
      </h3>
      <p className="mt-1.5 text-pretty text-base leading-relaxed text-card-foreground">
        {lead.quadro}
      </p>

      <div className="mt-5">
        {estado === "inicial" && (
          <button
            type="button"
            onClick={handleLiberar}
            disabled={esgotado}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {esgotado ? "Indisponível" : "Liberar Telefone / WhatsApp"}
          </button>
        )}

        {estado === "carregando" && (
          <div className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-muted px-5 py-3 text-sm font-medium text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Garantindo sua vaga...
          </div>
        )}

        {estado === "revelado" && (
          <div className="rounded-xl border border-success/30 bg-success/10 p-4">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-success">
              <Check className="h-4 w-4" aria-hidden="true" />
              Vaga garantida!
            </p>

            {telefone ? (
              <>
                <p className="mt-3 font-mono text-lg font-bold tracking-wide text-card-foreground">
                  {telefone}
                </p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <a
                    href={linkWhatsApp(telefone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-success px-4 py-2.5 text-sm font-semibold text-success-foreground transition-colors hover:bg-success/90"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Abrir no WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={handleCopiar}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-card-foreground transition-colors hover:bg-muted"
                  >
                    {copiado ? (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    )}
                    {copiado ? "Copiado!" : "Copiar número"}
                  </button>
                </div>
              </>
            ) : (
              <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-card-foreground">
                <ClipboardList
                  className="mt-0.5 h-4 w-4 shrink-0 text-success"
                  aria-hidden="true"
                />
                O clique foi registrado. Confira o número correspondente na sua
                planilha de controle.
              </p>
            )}
          </div>
        )}

        {estado === "erro" && (
          <button
            type="button"
            onClick={handleLiberar}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-5 py-3 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/15"
          >
            Erro ao liberar. Tentar novamente
          </button>
        )}
      </div>
    </article>
  )
}
