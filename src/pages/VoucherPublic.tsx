import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toPng } from "html-to-image";
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

  const handleSaveImage = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `voucher-${voucher?.code}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Imagem salva!");
    } catch {
      toast.error("Erro ao salvar imagem");
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
      />
      <Button onClick={handleSaveImage} disabled={saving} className="mt-6" size="lg">
        <Download className="mr-2 h-4 w-4" />
        {saving ? "Salvando..." : "Salvar como Imagem"}
      </Button>
    </div>
  );
};

export default VoucherPublic;
