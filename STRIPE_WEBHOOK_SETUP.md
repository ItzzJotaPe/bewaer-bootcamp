# Configuração do Webhook do Stripe

## Problema Identificado

Os pedidos pagos via Stripe não estão sendo atualizados automaticamente para o status "paid" porque o webhook não está configurado corretamente ou não está recebendo os eventos.

## Soluções Implementadas

### 1. Webhook Expandido

- Agora trata múltiplos eventos do Stripe:
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `invoice.payment_succeeded`

### 2. Verificação Manual

- Botão de refresh ao lado de pedidos pendentes
- Verifica manualmente o status no Stripe
- Atualiza o banco de dados se necessário

### 3. Logs de Debug

- Logs detalhados no webhook para facilitar troubleshooting
- Tratamento de erro robusto

## Configuração Necessária

### 1. Variáveis de Ambiente

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Configuração do Webhook no Stripe Dashboard

1. Acesse [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Clique em "Add endpoint"
3. Configure:
   - **Endpoint URL**: `https://seu-dominio.com/api/stripe/webhook`
   - **Events to send**:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `invoice.payment_succeeded`

### 3. Teste do Webhook

1. Use o Stripe CLI para testar:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

2. Ou use o botão "Send test webhook" no dashboard do Stripe

## Como Funciona Agora

### Fluxo de Pagamento

1. Usuário finaliza pedido → Status: "pending"
2. Redirecionado para Stripe Checkout
3. Pagamento realizado com sucesso
4. Stripe envia webhook com evento `checkout.session.completed`
5. Sistema atualiza status para "paid"

### Fallback Manual

Se o webhook falhar:

1. Usuário vê pedido como "Pagamento pendente"
2. Clica no botão de refresh (🔄)
3. Sistema verifica status diretamente no Stripe
4. Atualiza banco de dados se necessário

## Troubleshooting

### Verificar Logs

- Console do servidor para logs do webhook
- Stripe Dashboard > Webhooks > Recent deliveries

### Problemas Comuns

1. **Webhook não recebido**: Verificar URL e secret
2. **Signature inválida**: Verificar STRIPE_WEBHOOK_SECRET
3. **Evento não tratado**: Verificar se o evento está na lista de eventos configurados

### Teste com Cartão de Teste

- Use cartões de teste do Stripe
- Verifique se o webhook está sendo enviado
- Confirme se o status está sendo atualizado
