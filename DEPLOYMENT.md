# Publicação Baltigo Ads

Endereço principal: https://baltigo-ads.vercel.app/
Origem pública: https://qgbaltigo.github.io/Teste/
Contato comercial: https://t.me/QGSuporteBot

## Arquitetura atual

A Vercel funciona como proxy reverso do GitHub Pages. O visitante permanece no endereço Vercel; não há iframe nem redirecionamento para a origem. O GitHub Pages precisa permanecer ativo. Alterações publicadas na main são servidas pela origem e aparecem no endereço Vercel.

A conexão de login GitHub da conta Vercel não estava configurada; por isso não foi criada integração nativa GitHub/Vercel. Não remover o GitHub Pages sem antes migrar os arquivos para uma publicação estática independente na Vercel.

Projeto Vercel: baltigo-ads (`prj_vAzZEOtj3SjZeNPr60RzRtfzBAxx`).
Deployment verificado: `dpl_A2G7vf98wRWQN5XVMG6EZWUSntLb`.

## Configuração do gateway Vercel

Este JSON descreve o deployment separado da Vercel, não substitui o vercel.json estático na raiz do repositório:

```json
{
  "framework": null,
  "buildCommand": "",
  "outputDirectory": "public",
  "rewrites": [
    {"source":"/","destination":"https://qgbaltigo.github.io/Teste/"},
    {"source":"/:path*","destination":"https://qgbaltigo.github.io/Teste/:path*"}
  ],
  "headers": [{"source":"/(.*)","headers":[
    {"key":"Cache-Control","value":"no-store"},
    {"key":"X-Content-Type-Options","value":"nosniff"},
    {"key":"Referrer-Policy","value":"strict-origin-when-cross-origin"}
  ]}]
}
```

A pasta public do gateway contém apenas `_deployment.txt`. Não incluir index.html: um arquivo local nesse caminho pode prevalecer sobre a reescrita e ocultar a página completa.

## Verificação realizada

- Revisão visual: commit `540bf6f02f9cf48b229ea6585200012e602ccabb`.
- GitHub Pages e Vercel: HTTP 200, título correto, zero formulários, contato com QGSuporteBot, novo rodapé e nova folha de estilos presentes.
- Os 11 recursos referenciados (imagens, CSS e JavaScript) responderam 200 e continham dados em ambos os endereços.
- Verificação pública: workflow run `37549557131`, tentativa 2, job `112561925815`, concluído com sucesso.
- Layout e interações locais: 11 larguras, de 320 a 1920 px.

O workflow `.github/workflows/verify-baltigo.yml` permite repetir a verificação pública.
