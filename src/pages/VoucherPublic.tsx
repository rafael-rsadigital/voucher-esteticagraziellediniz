import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Download, Image as ImageIcon, Calendar } from "lucide-react";
import VoucherCard from "@/components/VoucherCard";
import { toast } from "sonner";

interface Voucher { id: string; code: string; client_name: string; service_name: string; created_at: string; expires_at: string; voucher_type: string; discount_amount: number | null; title: string | null; message: string | null; highlight_message: string | null; service_description: string | null; }

const VoucherPublic = () => {
  const { codigo } = useParams<{ codigo: string }>();
  const [voucher, setVoucher] = useState<Voucher | null>(null); const [notFound, setNotFound] = useState(false); const [saving, setSaving] = useState(false); const [savingImg, setSavingImg] = useState(false); const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (!codigo) return; supabase.from("vouchers").select("*").eq("code", codigo).single().then(({ data, error }) => { if (error || !data) setNotFound(true); else setVoucher(data); }); }, [codigo]);
  const renderCanvas = async () => { const node = cardRef.current!; if (document.fonts?.ready) await document.fonts.ready; await Promise.all(Array.from(node.querySelectorAll("img")).map((img) => img.complete && img.naturalWidth > 0 ? Promise.resolve() : new Promise<void>((resolve) => { img.onload = () => resolve(); img.onerror = () => resolve(); }))); return html2canvas(node, { scale: 3, backgroundColor: "#ffffff", useCORS: true, logging: false }); };
  const handleSavePdf = async () => { if (!cardRef.current) return; setSaving(true); try { const canvas = await renderCanvas(); const dataUrl = canvas.toDataURL("image/jpeg", 0.95); const width = cardRef.current.offsetWidth; const height = cardRef.current.offsetHeight; const pdf = new jsPDF({ orientation: height >= width ? "portrait" : "landscape", unit: "px", format: [width, height] }); pdf.addImage(dataUrl, "JPEG", 0, 0, width, height); pdf.save(`voucher-${voucher?.code}.pdf`); toast.success("PDF salvo!"); } catch { toast.error("Erro ao salvar PDF"); } setSaving(false); };
  const handleSaveImage = async () => { if (!cardRef.current) return; setSavingImg(true); try { const canvas = await renderCanvas(); const link = document.createElement("a"); link.download = `voucher-${voucher?.code}.png`; link.href = canvas.toDataURL("image/png"); link.click(); toast.success("Imagem salva!"); } catch { toast.error("Erro ao salvar imagem"); } setSavingImg(false); };
  if (notFound) return <div className="flex min-h-screen items-center justify-center bg-vink p-4"><div className="text-center"><h1 className="mb-2 font-serif text-2xl text-white">Voucher não encontrado</h1><p className="text-sm text-white/70">Verifique o código e tente novamente.</p></div></div>;
  if (!voucher) return <div className="flex min-h-screen items-center justify-center bg-vink"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" /></div>;
  const whatsappText = voucher.voucher_type === "desconto" ? `Oi! Eu recebi um voucher de desconto de R$${voucher.discount_amount ?? 30},00 e gostaria de agendar. O código do voucher é ${voucher.code}` : `Oi! Eu recebi um voucher para realizar ${voucher.service_name} e gostaria de agendar. O código do voucher é ${voucher.code}`;
  return <div className="relative flex min-h-screen flex-col items-center justify-start bg-vink px-4 py-6 pb-36 lg:justify-center">
    <div className="w-full max-w-[360px]"><VoucherCard ref={cardRef} clientName={voucher.client_name} code={voucher.code} expiresAt={voucher.expires_at} serviceName={voucher.service_name} voucherType={voucher.voucher_type} discountAmount={voucher.discount_amount} title={voucher.title} message={voucher.message} highlightMessage={voucher.highlight_message} serviceDescription={voucher.service_description} /></div>

    {/* Vídeo de apresentação do voucher */}
    <section className="mt-8 w-full max-w-[360px] text-center">
      <p className="mb-3 font-body text-[10px] font-medium uppercase tracking-[0.2em] text-white/80">Uma mensagem especial</p>
      <div className="overflow-hidden rounded-[14px] border border-white/20 bg-black/10 shadow-lg">
        <video className="block h-auto w-full" controls playsInline preload="metadata">
          <source src="/video-voucher.webm" type="video/webm" />
          Seu navegador não suporta a reprodução de vídeo.
        </video>
      </div>
    </section>

    <div className="mt-10 w-full max-w-[360px] overflow-hidden rounded-lg border border-white/20 shadow-sm"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.910082057528!2d-46.23737162465684!3d-23.98249917851274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce010cfde03e69%3A0x21cbbc8570ea3184!2sGrazielle%20Diniz%20-%20Est%C3%A9tica%20e%20Depila%C3%A7%C3%A3o%20a%20Laser!5e1!3m2!1spt-BR!2sbr!4v1785867093060!5m2!1spt-BR!2sbr" title="Localização - Grazielle Diniz Estética, Guarujá - SP" className="h-64 w-full border-0" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" /></div>
    <p className="mt-2 max-w-[360px] text-center text-xs text-white/75">Av. Dom Pedro I, 1785 - Sl 406 - Enseada, Guarujá - SP, 11440-002</p>
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-primary/10 bg-background/95 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm"><div className="mx-auto flex max-w-[360px] items-center justify-center gap-3"><Button onClick={handleSavePdf} disabled={saving} size="sm" className="flex-1"><Download className="mr-1.5 h-4 w-4" />{saving ? "Salvando..." : "PDF"}</Button><a href={`https://wa.me/5513991630136?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90"><Calendar className="h-4 w-4" />Agendar</a><Button onClick={handleSaveImage} disabled={savingImg} size="sm" variant="outline" className="flex-1"><ImageIcon className="mr-1.5 h-4 w-4" />{savingImg ? "Salvando..." : "Imagem"}</Button></div></div>
  </div>;
};
export default VoucherPublic;
