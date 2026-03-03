

## Voucher Estética Grazielle Diniz

Aplicação mobile-first para criar e compartilhar vouchers elegantes de experiências estéticas.

### Páginas e Fluxo

**1. Login Admin (`/admin/login`)**
- Tela simples com email/senha (credenciais fixas no código para simplicidade inicial)
- Redireiona para o painel admin

**2. Painel Admin (`/admin`)**
- Campo "Nome do Cliente" + botão "Gerar Voucher"
- Lista dos vouchers já gerados (código, cliente, validade, status)
- Ao gerar: cria código único de 4 caracteres alfanuméricos, calcula validade de 60 dias
- Exibe link gerado + botão "Copiar Link para WhatsApp" (com mensagem pré-formatada)

**3. Voucher Público (`/v/:codigo`)**
- Card vertical elegante (estilo 9:16) com:
  - Logotipo centralizado no topo
  - Título "Essência Feminina" em fonte cursiva
  - Descrição da experiência de Limpeza de Pele (1h30 a 2h)
  - Nome da cliente em destaque
  - Frase motivacional
  - Código único + data de validade no rodapé
  - Localização: São José dos Campos - SP
- Borda fina elegante no tom verde escuro do logo
- Botão "Salvar como Imagem" (usa html-to-canvas para download)

### Identidade Visual
- Fundo branco limpo, tipografia e detalhes em verde escuro (#1a6b5a, extraído do logo)
- Fonte cursiva elegante para o título (Google Fonts - ex: Great Vibes)
- Logo da marca centralizado em cada voucher
- Layout mobile-first, card com proporção vertical

### Backend (Lovable Cloud / Supabase)
- Tabela `vouchers`: id, code (4 chars), client_name, created_at, expires_at
- Autenticação simples para área admin
- Consulta pública do voucher por código

### Bibliotecas adicionais
- `html-to-image` para função de salvar voucher como imagem

