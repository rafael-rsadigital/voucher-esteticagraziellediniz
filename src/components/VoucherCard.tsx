import { forwardRef, Fragment, type ReactNode } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MapPin, Link as LinkIcon } from "lucide-react";

// Permite trechos em negrito com **texto**
const renderRich = (text: string): ReactNode =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={i} className="font-bold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );

interface VoucherCardProps {
  clientName: string;
  code: string;
  expiresAt: string;
  serviceName?: string;
  voucherType?: string;
  discountAmount?: number | null;
  title?: string | null;
  message?: string | null;
  highlightMessage?: string | null;
  serviceDescription?: string | null;
}

const VoucherCard = forwardRef<HTMLDivElement, VoucherCardProps>(
  (
    {
      clientName,
      code,
      expiresAt,
      serviceName = "Experiência Completa em Limpeza de Pele",
      voucherType = "presente",
      discountAmount,
      title,
      message,
      highlightMessage,
      serviceDescription,
    },
    ref
  ) => {
    const isDiscount = voucherType === "desconto";

    const whatsappText = isDiscount
      ? `Oi! Eu recebi um voucher de desconto de R$${discountAmount ?? 30},00 e gostaria de agendar. O código do voucher é ${code}`
      : `Oi! Eu recebi um voucher para realizar ${serviceName} e gostaria de agendar. O código do voucher é ${code}`;

    const hasTitle = !!title?.trim();
    const hasMessage = !!message?.trim();
    const hasHighlight = !!highlightMessage?.trim();

    const defaultServiceText = isDiscount
      ? `Este voucher dá direito a R$ ${discountAmount ?? 30},00 de desconto no seu próximo procedimento.`
      : `Este voucher dá direito a uma ${serviceName}, com duração de 1h30 a 2h.`;

    const serviceText = serviceDescription?.trim() || defaultServiceText;

    return (
      <div
        ref={ref}
        className="relative mx-auto flex w-full max-w-[360px] flex-col items-center bg-background px-8 py-7"
        style={{ aspectRatio: "9/16" }}
      >
        {/* Elegant border */}
        <div className="pointer-events-none absolute inset-3 rounded-lg border border-primary/30" />
        <div className="pointer-events-none absolute inset-4 rounded-lg border border-primary/15" />

        {/* Logo */}
        <img
          src="/logo-grazielle.jpg"
          alt="Estética Grazielle Diniz"
          className="mb-4 h-20 w-20 rounded-full object-cover shadow-md"
        />

        {/* Title (optional) */}
        {hasTitle && (
          <h1 className="mb-2 text-center font-cursive text-[28px] font-semibold leading-tight text-primary">
            {renderRich(title!)}
          </h1>
        )}

        {/* Free message */}
        {hasMessage && (
          <p className="whitespace-pre-line text-center font-serif text-[17px] leading-snug text-primary">
            {renderRich(message!)}
          </p>
        )}

        {/* Highlight (cursive) */}
        {hasHighlight && (
          <p className="mt-2 whitespace-pre-line text-center font-cursive text-[24px] font-medium leading-tight text-primary">
            {renderRich(highlightMessage!)}
          </p>
        )}

        {/* Decorative line */}
        <div className="my-3 flex items-center gap-3">
          <div className="h-px w-12 bg-primary/30" />
          <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
          <div className="h-px w-12 bg-primary/30" />
        </div>

        {/* Service description (free text) */}
        <p className="whitespace-pre-line text-center text-sm leading-relaxed text-foreground/85">
          {renderRich(serviceText)}
        </p>

        {/* Code */}
        <div className="mt-4 flex flex-col items-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Código do voucher
          </p>
          <div className="mt-1.5 rounded-md border border-dashed border-primary/40 px-6 py-1.5">
            <span className="font-serif text-xl font-bold tracking-wider text-primary">{code}</span>
          </div>
        </div>

        {/* Client name */}
        <div className="mt-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Para</p>
          <p className="mt-1 font-serif text-xl font-semibold text-primary">{clientName}</p>
        </div>

        {/* Spacer */}
        <div className="min-h-3 flex-1" />

        {/* Motivational */}
        <p className="mb-2 text-center font-serif text-xs italic text-muted-foreground">
          {isDiscount
            ? "Cuide-se, você merece!"
            : "\"Um momento de renovação, cuidado e autoestima.\""}
        </p>

        {/* Agendar button */}
        <a
          href={`https://wa.me/5513991630136?text=${encodeURIComponent(whatsappText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative mb-3 inline-flex items-center justify-center overflow-hidden rounded-md bg-primary px-8 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
        >
          <span className="absolute inset-0 -translate-x-full animate-[shine_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          Agendar
        </a>

        {/* Conhecer Grazielle Diniz */}
        <div className="mb-5 flex flex-col items-center">
          <p className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            Conhecer Grazielle Diniz
          </p>
          <a
            href="https://esteticagraziellediniz.com/bio/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-background px-5 py-1.5 font-serif text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            <LinkIcon className="h-3 w-3" />
            esteticagraziellediniz.com/bio
          </a>
        </div>

        {/* Footer */}
        <div className="w-full space-y-2 text-center">
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>
              Válido até:{" "}
              <span className="font-semibold">
                {format(new Date(expiresAt), "dd/MM/yyyy", { locale: ptBR })}
              </span>
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground/70">
            Esse voucher é pessoal e intransferível.
          </p>
          <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span>Av. Dom Pedro I, 1785 - Sl 406 - Enseada, Guarujá - SP</span>
          </div>
        </div>
      </div>
    );
  }
);

VoucherCard.displayName = "VoucherCard";

export default VoucherCard;
