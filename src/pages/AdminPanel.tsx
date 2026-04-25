import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, LogOut, Plus, Link as LinkIcon, Gift, Percent, ArrowLeft, Pencil } from "lucide-react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

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

const SERVICES = ["Limpeza de Pele", "Drenagem Linfática"];
const TITLE_SUGGESTIONS_PRESENTE = ["Mês da Mulher", "Aniversário", "Dia das Mães", "Natal"];
const TITLE_SUGGESTIONS_DESCONTO = ["Voucher Desconto", "Oferta Especial", "Cliente Fiel"];

const generateCode = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const AdminPanel = () => {
  const [step, setStep] = useState<"select-type" | "form">("select-type");
  const [voucherType, setVoucherType] = useState<"presente" | "desconto">("presente");
  const [clientName, setClientName] = useState("");
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [discountAmount, setDiscountAmount] = useState(30);
  const [editingDiscount, setEditingDiscount] = useState(false);
  const [title, setTitle] = useState("Mês da Mulher");
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastCreated, setLastCreated] = useState<Voucher | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchVouchers();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate("/admin/login");
  };

  const fetchVouchers = async () => {
    const { data, error } = await supabase
      .from("vouchers")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setVouchers(data);
  };

  const handleSelectType = (type: "presente" | "desconto") => {
    setVoucherType(type);
    setStep("form");
    setLastCreated(null);
    setTitle(type === "desconto" ? "Voucher Desconto" : "Mês da Mulher");
  };

  const handleGenerate = async () => {
    if (!clientName.trim()) {
      toast.error("Digite o nome da cliente");
      return;
    }

    setLoading(true);
    const code = generateCode();

    const expiresAt = voucherType === "desconto"
      ? addDays(new Date(), 30).toISOString()
      : new Date("2025-04-30T23:59:59").toISOString();

    const serviceName = voucherType === "presente"
      ? `Experiência Completa em ${selectedService}`
      : "Desconto em procedimento";

    const { data, error } = await supabase
      .from("vouchers")
      .insert({
        code,
        client_name: clientName.trim(),
        service_name: serviceName,
        expires_at: expiresAt,
        voucher_type: voucherType,
        discount_amount: voucherType === "desconto" ? discountAmount : null,
        title: title.trim() || null,
      })
      .select()
      .single();

    if (error) {
      toast.error("Erro ao gerar voucher");
    } else {
      toast.success("Voucher gerado com sucesso!");
      setLastCreated(data);
      setClientName("");
      fetchVouchers();
    }
    setLoading(false);
  };

  const getVoucherUrl = (code: string) => `${window.location.origin}/v/${code}`;

  const buildWhatsAppMessage = (v: Voucher) => {
    const url = getVoucherUrl(v.code);
    if (v.voucher_type === "desconto") {
      const amount = v.discount_amount ?? 30;
      return `✨ Olá ${v.client_name}! ✨\n\nVocê ganhou R$${amount},00 de desconto no seu próximo procedimento na Estética Grazielle Diniz!\n\n📅 Válido até: ${format(new Date(v.expires_at), "dd/MM/yyyy")}\n🔑 Código: ${v.code} (pessoal e intransferível)\n\nAcesse seu voucher: ${url}\n\nAguardamos você! 💚`;
    }
    return `✨ Olá ${v.client_name}! ✨\n\nVocê recebeu um voucher exclusivo da Estética Grazielle Diniz!\n\n🎁 ${v.service_name}\n📅 Válido até: ${format(new Date(v.expires_at), "dd/MM/yyyy")}\n\nAcesse seu voucher: ${url}\n\nAguardamos você! 💚`;
  };

  const copyToWhatsApp = (v: Voucher) => {
    navigator.clipboard.writeText(buildWhatsAppMessage(v));
    toast.success("Mensagem copiada para o WhatsApp!");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const isExpired = (date: string) => new Date(date) < new Date();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-grazielle.jpg" alt="Logo" className="h-10 w-10 rounded-full object-cover" />
            <h1 className="font-serif text-lg font-semibold text-primary">Painel Admin</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-1 h-4 w-4" /> Sair
          </Button>
        </div>

        {/* Step: Select Type */}
        {step === "select-type" && (
          <Card className="mb-6 border-primary/20">
            <CardHeader>
              <CardTitle className="font-serif text-lg text-primary">Selecione o Tipo de Voucher</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSelectType("presente")}
                className="flex flex-col items-center gap-3 rounded-lg border-2 border-primary/20 p-6 transition-all hover:border-primary hover:bg-secondary"
              >
                <Gift className="h-10 w-10 text-primary" />
                <span className="font-serif font-semibold text-primary">Voucher Presente</span>
                <span className="text-center text-xs text-muted-foreground">
                  Experiência completa em um serviço
                </span>
              </button>
              <button
                onClick={() => handleSelectType("desconto")}
                className="flex flex-col items-center gap-3 rounded-lg border-2 border-primary/20 p-6 transition-all hover:border-primary hover:bg-secondary"
              >
                <Percent className="h-10 w-10 text-primary" />
                <span className="font-serif font-semibold text-primary">Voucher Desconto</span>
                <span className="text-center text-xs text-muted-foreground">
                  Desconto no próximo procedimento
                </span>
              </button>
            </CardContent>
          </Card>
        )}

        {/* Step: Form */}
        {step === "form" && (
          <>
            <Button variant="ghost" size="sm" className="mb-4" onClick={() => setStep("select-type")}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
            </Button>

            <Card className="mb-6 border-primary/20">
              <CardHeader>
                <CardTitle className="font-serif text-lg text-primary">
                  {voucherType === "presente" ? "Gerar Voucher Presente" : "Gerar Voucher Desconto"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Nome da Cliente</Label>
                  <Input
                    id="client"
                    placeholder="Ex: Maria Silva"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Título do Voucher</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Mês da Mulher"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {(voucherType === "desconto" ? TITLE_SUGGESTIONS_DESCONTO : TITLE_SUGGESTIONS_PRESENTE).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setTitle(s)}
                        className="rounded-full border border-primary/20 bg-secondary/50 px-2.5 py-0.5 text-xs text-primary transition-colors hover:bg-secondary"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {voucherType === "presente" && (
                  <div className="space-y-2">
                    <Label>Serviço</Label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Será gerado: <span className="font-medium text-primary">Experiência Completa em {selectedService}</span>
                    </p>
                  </div>
                )}

                {voucherType === "desconto" && (
                  <div className="space-y-2">
                    <Label>Valor do Desconto</Label>
                    <div className="flex items-center gap-2">
                      {editingDiscount ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">R$</span>
                          <Input
                            type="number"
                            value={discountAmount}
                            onChange={(e) => setDiscountAmount(Number(e.target.value))}
                            className="w-24"
                            onBlur={() => setEditingDiscount(false)}
                            onKeyDown={(e) => e.key === "Enter" && setEditingDiscount(false)}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-primary">
                            R$ {discountAmount},00
                          </span>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingDiscount(true)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Validade: 30 dias a partir de hoje
                    </p>
                  </div>
                )}

                <Button onClick={handleGenerate} disabled={loading} className="w-full">
                  <Plus className="mr-1 h-4 w-4" />
                  {loading ? "Gerando..." : "Gerar Voucher"}
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Last created */}
        {lastCreated && (
          <Card className="mb-6 border-primary/30 bg-secondary">
            <CardContent className="p-4">
              <p className="mb-2 text-sm font-medium text-primary">
                Voucher {lastCreated.voucher_type === "desconto" ? "de desconto" : "presente"} criado para {lastCreated.client_name}:
              </p>
              <div className="flex items-center gap-2 rounded-md bg-background p-2 text-sm">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 truncate">{getVoucherUrl(lastCreated.code)}</span>
              </div>
              <Button size="sm" variant="secondary" className="mt-2 w-full" onClick={() => copyToWhatsApp(lastCreated)}>
                <Copy className="mr-1 h-4 w-4" /> Copiar Mensagem para WhatsApp
              </Button>
            </CardContent>
          </Card>
        )}

        {/* List */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="font-serif text-lg text-primary">Vouchers Gerados</CardTitle>
          </CardHeader>
          <CardContent>
            {vouchers.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">Nenhum voucher gerado ainda.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vouchers.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-mono font-bold text-primary">{v.code}</TableCell>
                      <TableCell>{v.client_name}</TableCell>
                      <TableCell>
                        {v.voucher_type === "desconto" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-medium">
                            <Percent className="h-3 w-3" /> R${v.discount_amount ?? 30}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                            <Gift className="h-3 w-3" /> Presente
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={isExpired(v.expires_at) ? "text-destructive" : "text-muted-foreground"}>
                          {format(new Date(v.expires_at), "dd/MM/yyyy")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button size="icon" variant="ghost" onClick={() => copyToWhatsApp(v)} title="Copiar para WhatsApp">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
