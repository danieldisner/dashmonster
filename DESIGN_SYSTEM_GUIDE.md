# Dashmonster Design System & Architecture Guide

## Visão Geral

Este documento serve como referência viva para o design system, arquitetura de componentes e estrutura de dados do projeto Dashmonster. Ele é voltado para designers e desenvolvedores que desejam evoluir o painel admin, criar novos componentes, documentar padrões e facilitar a extração/reutilização do design system.

---

## 1. Princípios do Design System

- **Visual Progressivo:** O visual do painel deve evoluir continuamente, incorporando tendências, feedbacks e boas práticas de UI/UX.
- **Consistência:** Componentes reutilizáveis, tokens de design e padrões claros para garantir identidade visual e experiência consistente.
- **Acessibilidade:** Todos os componentes devem ser acessíveis (teclado, contraste, ARIA, etc).
- **Documentação:** Cada componente, token e padrão deve ser documentado com exemplos de uso, props, variantes e guidelines visuais.
- **Adaptabilidade:** O design system deve ser facilmente extraído e utilizado em outros projetos.

---

## 2. Estrutura do Projeto

```
/design-system
  /components      # Componentes atômicos e compostos (Button, Card, Table, etc)
  /tokens          # Tokens de cor, tipografia, espaçamento, etc
  /index.ts        # Exporta todos os componentes/tokens
/features         # Lógicas e UIs específicas de domínio
/components       # Componentes de página e layouts
/services         # Serviços de dados (API, mock, etc)
/types            # Tipos TypeScript para dados e props
```

---

## 3. Como Documentar Componentes

Cada componente deve conter:
- Descrição do propósito
- Lista de props e tipos
- Exemplos de uso (código e preview visual)
- Guidelines de acessibilidade
- Estados visuais (hover, focus, disabled, etc)
- Variações (ex: Button: primary, secondary, ghost...)

Sugestão: Use comentários JSDoc nos arquivos `.tsx` e mantenha exemplos em um Storybook ou MDX.

---

## 4. Como Extrair o Design System

1. **Isolar o diretório `design-system/`**: Ele deve ser independente, sem dependências de features ou serviços do app.
2. **Exportar via `design-system/index.ts`**: Garanta que todos os componentes/tokens estejam exportados por esse arquivo.
3. **Documentação junto**: Inclua este documento e exemplos de uso.
4. **Publicação**: Você pode publicar como pacote npm privado, monorepo, ou copiar o diretório para outros projetos.

---

## 5. Estrutura de Dados

- Todos os modelos de dados (usuário, permissões, etc) devem estar em `/types`.
- Use TypeScript estrito para garantir tipagem e facilitar integração com componentes.
- Documente cada tipo com comentários JSDoc.

---

## 6. Boas Práticas para Evoluir o Design System

- Sempre crie variantes e tokens antes de customizações pontuais.
- Prefira composição de componentes a herança.
- Use hooks para lógica de UI reutilizável.
- Mantenha exemplos e testes para cada componente.
- Atualize este documento a cada melhoria relevante.

---

## 7. Ferramentas Sugeridas

- **Storybook**: Para documentação visual e playground de componentes.
- **Style Dictionary**: Para tokens de design exportáveis.
- **Plop.js**: Para scaffolding de novos componentes com template documentado.

---

## 8. Roadmap Sugerido

- [ ] Adicionar Storybook ao projeto
- [ ] Documentar todos os componentes existentes
- [ ] Criar tokens globais de cor, tipografia, espaçamento
- [ ] Garantir acessibilidade em todos os componentes
- [ ] Automatizar extração/publicação do design system

---

## 9. Referências

- [Design Systems Repo](https://designsystemsrepo.com/)
- [Storybook](https://storybook.js.org/)
- [Acessibilidade Web](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

> Mantenha este documento sempre atualizado conforme o design system evoluir!
