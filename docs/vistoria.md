# Vistoria de segurança: Ponto Vermelho

Vistoria curta feita antes de entregar o site. Escopo: tudo o que está neste repositório. O site é estático e é uma demonstração com dados fictícios.

## O que foi verificado

| Ponto | Resultado |
|---|---|
| Política de segurança de conteúdo (CSP) | `index.html` traz `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'`. Não há script nem estilo embutido, nem atributo `style` no HTML. A página `404.html` usa `script-src 'none'`. |
| Envio de dados | Nenhum. Não há `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon` nem formulário com destino. Os formulários chamam `preventDefault` e só escrevem na tela. O teste automatizado confirma que nenhuma requisição sai para fora do próprio site. |
| O que fica no navegador | Só a lista de pré-reservas da agenda, em `localStorage`, na chave `pv-prereservas`: data, período e um código gerado na hora. O site avisa isso na própria agenda e há botões para cancelar uma pré-reserva ou apagar todas. Nome, e-mail, telefone e mensagem do convite NÃO são guardados em lugar nenhum. |
| Dependências | Nenhuma. Sem framework, sem biblioteca, sem CDN, sem analytics, sem fonte externa. Duas fontes locais com licença SIL OFL (`fonts/`). |
| Links externos | Um só: https://mileumalinhas.com.br (faixa de demonstração, "Como isto funciona" e rodapé). |
| Escrita na página | Todo texto vindo de dados ou do visitante entra com `textContent` (nunca `innerHTML` com dado do visitante). O único `innerHTML` do código serve para esvaziar listas (`""`). |
| Segredos e dados pessoais | Nenhum. Nomes, empresas, datas e preços são inventados. Os e-mails e telefones dos testes são de exemplo. |
| Arquivos públicos | `robots.txt` e `sitemap.xml` com a URL pública do site; `google20db0e080e71c701.html` com o texto de verificação do Google. |

## Riscos residuais

- A CSP em `<meta>` não cobre cabeçalhos HTTP como `frame-ancestors` e `X-Content-Type-Options`; o GitHub Pages não deixa configurá-los. Em um servidor próprio, vale repetir a CSP como cabeçalho.
- O `localStorage` é legível por qualquer pessoa que use o mesmo navegador e perfil. Por isso só guarda dados sem valor (data e período fictícios).
- Se o site virar um sistema de verdade (receber convites, cobrar), será preciso um servidor, validação do lado dele, proteção contra robôs e uma política de privacidade. Nada disso existe aqui de propósito.
