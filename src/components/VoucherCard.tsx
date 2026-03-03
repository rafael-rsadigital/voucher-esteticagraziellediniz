import { forwardRef } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MapPin } from "lucide-react";

interface VoucherCardProps {
  clientName: string;
  code: string;
  expiresAt: string;
}

const VoucherCard = forwardRef<HTMLDivElement, VoucherCardProps>(
  ({ clientName, code, expiresAt }, ref) => {
    return (
      <div
        ref={ref}
        className="relative mx-auto flex w-full max-w-[360px] flex-col items-center bg-background px-8 py-10"
        style={{ aspectRatio: "9/16" }}
      >
        {/* Elegant border */}
        <div className="pointer-events-none absolute inset-3 rounded-lg border border-primary/30" />
        <div className="pointer-events-none absolute inset-4 rounded-lg border border-primary/15" />

        {/* Logo */}
        <img
          src="/logo-grazielle.jpg"
          alt="Estética Grazielle Diniz"
          className="mb-6 h-24 w-24 rounded-full object-cover shadow-md"
        />

        {/* Title */}
        <h1 className="mb-1 font-cursive text-4xl text-primary">Mês da Mulher</h1>

        {/* Decorative line */}
        <div className="my-4 flex items-center gap-3">
          <div className="h-px w-12 bg-primary/30" />
          <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
          <div className="h-px w-12 bg-primary/30" />
        </div>

        {/* Description */}
        <p className="mb-6 text-center font-serif text-sm leading-relaxed text-foreground/80">
          Este voucher dá direito a uma{" "}
          <span className="font-semibold text-primary">Experiência Completa de Limpeza de Pele</span>{" "}
          com duração de 1h30 a 2h.
        </p>

        {/* Client name */}
        <div className="mb-4 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Para</p>
          <p className="mt-1 font-serif text-xl font-semibold text-primary">{clientName}</p>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Motivational */}
        <p className="mb-2 text-center font-serif text-xs italic text-muted-foreground">
          "Um momento de renovação, cuidado e autoestima."
        </p>

        {/* Agendar button */}
        <a
          href={`https://wa.me/5512987056599?text=${encodeURIComponent(`Oi! Eu recebi um voucher para realizar uma limpeza de pele e gostaria de agendar. O código do voucher é ${code}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative mb-4 inline-flex items-center justify-center overflow-hidden rounded-md bg-primary px-8 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
        >
          <span className="absolute inset-0 -translate-x-full animate-[shine_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          Agendar
        </a>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="w-full space-y-2 text-center">
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>
              Código: <span className="font-mono font-bold text-primary">{code}</span>
            </span>
            <span className="h-3 w-px bg-primary/20" />
            <span>
              Válido até:{" "}
              <span className="font-semibold">
                {format(new Date(expiresAt), "dd/MM/yyyy", { locale: ptBR })}
              </span>
            </span>
          </div>
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>R. Paulo Setúbal, 179 - Sala 11 - Jardim São Dimas, São José dos Campos</span>
          </div>
        </div>
      </div>
    );
  }
);

VoucherCard.displayName = "VoucherCard";

export default VoucherCard;
