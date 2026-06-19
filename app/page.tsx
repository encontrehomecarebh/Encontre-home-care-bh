import { HeartPulse } from "lucide-react"
import { OpportunitiesPanel } from "@/components/opportunities-panel"

export default function Page() {
  return (
    <main className="mx-auto min-h-svh w-full max-w-2xl px-4 py-8 sm:py-12">
      <header className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">
          <HeartPulse className="h-4 w-4" aria-hidden="true" />
          Home Care BH
        </div>
        <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Oportunidades de Home Care Disponíveis
        </h1>
        <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
          Pacientes em Belo Horizonte buscando profissionais agora. Libere o
          contato e fale diretamente pelo WhatsApp.
        </p>
      </header>

      <OpportunitiesPanel />

      <footer className="mt-10 text-center text-xs text-muted-foreground">
        Atualizado em tempo real • Vagas limitadas por orçamento
      </footer>
    </main>
  )
}
