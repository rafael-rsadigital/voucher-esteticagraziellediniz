# Voucher Essencial

"Crie uma aplicação Web mobile-first chamada 'Voucher Estética Grazielle Diniz' com o seguinte fluxo e design:

1. Identidade Visual:

Cores: Fundo branco limpo. Tipografia e detalhes no tom de verde escuro do logotipo anexo.

Layout: Vertical (estilo card/stories 9:16). Use uma borda fina e elegante inspirada no estilo clássico da imagem de referência.

Logotipo: Centralizado no topo de cada voucher gerado.

2. Sistema de Gerenciamento (Admin):

Crie uma tela de login simples para a Grazielle.

Painel: Um campo de input para 'Nome do Cliente' e um botão 'Gerar Voucher'.

Lógica: Ao gerar, o sistema deve criar um ID único de 4 caracteres (ex: R4B2) e salvar no banco de dados.

Validade: O sistema deve calcular automaticamente a validade para 60 dias a partir da data de geração.

3. Visualização do Voucher (Pública):

Rota Dinâmica: O voucher deve ser acessível via /v/:codigo (ex: meuapp.lovable.app/v/R4B2).

Conteúdo do Card: * Logotipo no topo.

Título: 'Essência Feminina' em fonte cursiva elegante.

Texto: 'Este voucher dá direito a uma Experiência Completa de Limpeza de Pele com duração de 1h30 a 2h'.

Nome da Cliente em destaque (ex: 'Para: Fulana de Tal').

'Um momento de renovação, cuidado e autoestima'.

Data de validade e o Código Único no rodapé.

Localização: 'São José dos Campos - SP'.

4. Funcionalidades de Compartilhamento:

Após a geração no painel admin, exiba o link gerado e um botão 'Copiar Link para WhatsApp'.

Adicione um botão 'Salvar como Imagem' na página do voucher para que a cliente possa tirar um print perfeito ou baixar o card."

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://voucher-esteticagraziellediniz.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/076f69ff-970f-4346-bad6-34509033a870).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
