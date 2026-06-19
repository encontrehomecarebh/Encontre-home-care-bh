"use client"

import { useCallback, useEffect, useState } from "react"
import { Loader2, RefreshCw, Inbox, AlertCircle } from "lucide-react"
import { type Lead, carregarLeads } from "@/lib/leads"
import { OpportunityCard } from "@/components/opportunity-card"

type Status = "carregando" | "pronto" | "erro"

export function OpportunitiesPanel() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [status, setStatus] = useState<Status>("carregando")
  const [atualizando, setAtualizando] = useState(false)

  const buscar = useCallback(async (silencioso = false) => {
    if (silencioso) setAtualizando(true)
    else setStatus("carregando")
    try {
      const dados = await carregarLeads()
      setLeads(dados)
      setStatus("pronto")
    } catch {
      setStatus("erro")
    } finally {
      setAtualizando(false)
    }
  }, [])

  useEffect(() => {
    buscar()
  }, [buscar])

  if (status === "carregando") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
        <p className="text-sm">Carregando oportunidades em tempo real...</p>
      </div>
    )
  }

  if (status === "erro") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 py-16 text-center">
        <AlertCircle className="h-7 w-7 text-destructive" aria-hidden="true" />
        <p className="text-sm font-medium text-card-foreground">
          Não foi possível carregar as oportunidades.
        </p>
        <button
          type="button"
          onClick={() => buscar()}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Tentar novamente
        </button>
      </div>
    )
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card py-16 text-center">
        <Inbox className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm font-medium text-card-foreground">
          Nenhuma oportunidade disponível no momento.
        </p>
        <p className="text-sm text-muted-foreground">Volte mais tarde!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {leads.length}{" "}
          {leads.length === 1
            ? "oportunidade disponível"
            : "oportunidades disponíveis"}
        </p>
        <button
          type="button"
          onClick={() => buscar(true)}
          disabled={atualizando}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-card-foreground transition-colors hover:bg-muted disabled:opacity-60"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${atualizando ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
          Atualizar
        </button>
      </div>

      {leads.map((lead) => (
        <OpportunityCard key={lead.id} lead={lead} />
      ))}
    </div>
  )
}
