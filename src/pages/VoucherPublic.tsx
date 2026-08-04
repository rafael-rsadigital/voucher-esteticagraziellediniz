import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import VoucherCard from "@/components/VoucherCard";
import { toast } from "sonner";

interface Voucher {
  id: string;
  code: string;
  client_name: string;
  service_name: string;
  created_at: string;
  expires_at: string;
  voucher_type: string;
  discount_amount: number | null;
  title: string | null;
}

const VoucherPublic = () => {
  const { codigo } = useParams<{ codigo: string }>();
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!codigo) return;
    supabase
      .from("vouchers")
      .select("*")
      .eq("code", codigo)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setVoucher(data);
      });
  }, [codigo]);

  const handleSavePdf = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    try {
      const node = cardRef.current;

      // Garante que fontes e imagens estejam carregadas antes de renderizar
      if (document.fonts?.ready) await document.fonts.ready;
      await Promise.all(
        Array.from(node.querySelectorAll("img")).map(
          (img) =>
            img.complete && img.naturalWidth > 0
              ? Promise.resolve()
              : new Promise<void>((resolve) => {
                  img.onload = () => resolve();
                  img.onerror = () => resolve();
                })
        )
      );

      const width = node.offsetWidth;
      const height = node.offsetHeight;

      const options = {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
        width,
        height,
      };

      // Primeiras chamadas podem sair em branco (fontes/imagens): repetimos
      let dataUrl = "";
      for (let i = 0; i < 3; i++) {
        dataUrl = await toPng(node, options);
        await new Promise((r) => setTimeout(r, 120));
      }

      if (!dataUrl || dataUrl.length < 5000) {
        throw new Error("Falha ao renderizar o voucher");
      }

      const pdf = new jsPDF({
        orientation: height >= width ? "portrait" : "landscape",
        unit: "px",
        format: [width, height],
      });
      pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
      pdf.save(`voucher-${voucher?.code}.pdf`);
      toast.success("PDF salvo!");
    } catch {
      toast.error("Erro ao salvar PDF");
    }
    setSaving(false);
  };



  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="text-center">
          <h1 className="mb-2 font-serif text-2xl text-primary">Voucher não encontrado</h1>
          <p className="text-sm text-muted-foreground">Verifique o código e tente novamente.</p>
        </div>
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <VoucherCard
        ref={cardRef}
        clientName={voucher.client_name}
        code={voucher.code}
        expiresAt={voucher.expires_at}
        serviceName={voucher.service_name}
        voucherType={voucher.voucher_type}
        discountAmount={voucher.discount_amount}
        title={voucher.title}
      />
      <Button onClick={handleSavePdf} disabled={saving} className="mt-6" size="lg">
        <Download className="mr-2 h-4 w-4" />
        {saving ? "Salvando..." : "Salvar em PDF"}
      </Button>

      <div className="mt-8 w-full max-w-[360px] overflow-hidden rounded-lg border border-primary/20 shadow-sm">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.910082057528!2d-46.23737162465684!3d-23.98249917851274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce010cfde03e69%3A0x21cbbc8570ea3184!2sGrazielle%20Diniz%20-%20Est%C3%A9tica%20e%20Depila%C3%A7%C3%A3o%20a%20Laser!5e1!3m2!1spt-BR!2sbr!4v1785867093060!5m2!1spt-BR!2sbr"
          title="Localização - Grazielle Diniz Estética, Guarujá - SP"
          className="h-64 w-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <p className="mt-2 max-w-[360px] text-center text-xs text-muted-foreground">
        Av. Dom Pedro I, 1785 - Sl 406 - Enseada, Guarujá - SP, 11440-002
      </p>
    </div>
  );
};

export default VoucherPublic;
