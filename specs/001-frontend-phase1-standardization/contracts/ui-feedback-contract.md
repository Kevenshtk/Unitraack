# UI Feedback Contract: Sonner Toasts & ConfirmDialog

**Feature**: `001-frontend-phase1-standardization`  
**Date**: 2026-11-05

## 1. Contrato de Notificações Transitórias (`sonner`)

### 1.1 Montagem Global
- **Arquivo**: `frontend/src/App.tsx`
- **Componente**: `<Toaster position="top-right" richColors closeButton expand={false} />`
- **Comportamento**:
  - `toast.success(title, { description })`: Confirmação de operações concluídas (ex.: atualização de membro, envio de transferência, cancelamento concluído, cópia de link).
  - `toast.error(title, { description })`: Falhas de rede, erros retornados pela API (`err.response?.data?.error`) ou validações bloqueantes.
  - `toast.warning(title, { description })`: Alertas preventivos (ex.: matrícula obrigatória, senha com menos de 6 caracteres, sessão expirada por inatividade).

---

## 2. Contrato do Componente e Hook `ConfirmDialog`

- **Arquivo**: `frontend/src/components/common/ConfirmDialog.tsx`
- **Montagem do Provider**: `<ConfirmDialogProvider>` em `frontend/src/App.tsx` (ao lado do `<Toaster />`).

### 2.1 Assinatura Pública

```typescript
export interface ConfirmInputConfig {
  type?: 'text' | 'textarea';
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  errorMessage?: string;
}

export interface ConfirmOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  inputConfig?: ConfirmInputConfig;
}

export interface ConfirmResult {
  isConfirmed: boolean;
  value?: string;
}

export function useConfirm(): (options: ConfirmOptions) => Promise<ConfirmResult>;
```

### 2.2 Requisitos de Acessibilidade e Interação (WCAG / TailwindCSS)
- Atributos obrigatórios no container do diálogo: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`.
- Pressionar a tecla `Escape` ou clicar no backdrop fecha o modal resolvendo `{ isConfirmed: false }`.
- Se `inputConfig.required` for `true` (padrão quando `inputConfig` é fornecido) e o texto estiver vazio (`.trim() === ''`), a submissão deve ser impedida e `inputConfig.errorMessage` (default: `'Este campo é obrigatório.'`) deve ser exibido no modal.

