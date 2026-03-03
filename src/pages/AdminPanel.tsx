import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Copy, LogOut, Plus, Link as LinkIcon } from "lucide-react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Voucher {
  id: string;
  code: string;
  client_name: string;
  created_at: string;
  expires_at: string;
}

const generateCode = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const AdminPanel = () => {
  const [clientName, setClientName] = useState("");
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

  const handleGenerate = async () => {
    if (!clientName.trim()) {
      toast.error("Digite o nome da cliente");
      return;
    }

    setLoading(true);
    const code = generateCode();
    const expiresAt = addDays(new Date(), 60).toISOString();

    const { data, error } = await supabase
      .from("vouchers")
      .insert({ code, client_name: clientName.trim(), expires_at: expiresAt })
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

  const copyToWhatsApp = (voucher: Voucher) => {
    const url = getVoucherUrl(voucher.code);
    const msg = `✨ Olá ${voucher.client_name}! ✨\n\nVocê recebeu um voucher exclusivo da Estética Grazielle Diniz!\n\n🎁 Experiência Completa de Limpeza de Pele\n📅 Válido até: ${format(new Date(voucher.expires_at), "dd/MM/yyyy")}\n\nAcesse seu voucher: ${url}\n\nAguardamos você! 💚`;
    navigator.clipboard.writeText(msg);
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

        {/* Generate */}
        <Card className="mb-6 border-primary/20">
          <CardHeader>
            <CardTitle className="font-serif text-lg text-primary">Gerar Novo Voucher</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client">Nome da Cliente</Label>
              <Input
                id="client"
                placeholder="Ex: Maria Silva"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              <Plus className="mr-1 h-4 w-4" />
              {loading ? "Gerando..." : "Gerar Voucher"}
            </Button>
          </CardContent>
        </Card>

        {/* Last created */}
        {lastCreated && (
          <Card className="mb-6 border-primary/30 bg-secondary">
            <CardContent className="p-4">
              <p className="mb-2 text-sm font-medium text-primary">Voucher criado para {lastCreated.client_name}:</p>
              <div className="flex items-center gap-2 rounded-md bg-background p-2 text-sm">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 truncate">{getVoucherUrl(lastCreated.code)}</span>
              </div>
              <Button size="sm" variant="secondary" className="mt-2 w-full" onClick={() => copyToWhatsApp(lastCreated)}>
                <Copy className="mr-1 h-4 w-4" /> Copiar Link para WhatsApp
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
