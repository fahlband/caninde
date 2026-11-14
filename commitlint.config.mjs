// Valida mensagens de commit e títulos de PR no padrão Conventional Commits.
// Usado pelo hook commit-msg (husky) e pelo workflow conventional-commits.yml.
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Os escopos seguem os módulos e pastas do monorepo; não restringimos a lista
    // para não travar PRs que toquem áreas novas.
    "scope-case": [2, "always", "kebab-case"],
  },
};
