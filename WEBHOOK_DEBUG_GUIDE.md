# Guia de Debug do Webhook do Stripe

## 🚨 Problema Atual

Os pedidos pagos via Stripe ainda aparecem como "Pagamento pendente" na página `/my-orders`.

## 🔍 Passos para Debug

### 1. Verificar Configuração do Webhook

Acesse [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks) e verifique:

- ✅ **Endpoint URL** está correto: `https://seu-dominio.com/api/stripe/webhook`
- ✅ **Events** configurados:
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `invoice.payment_succeeded`
- ✅ **Webhook Secret** está configurado

### 2. Verificar Variáveis de Ambiente

Confirme que seu arquivo `.env.local` contém:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Testar Endpoint de Teste

Acesse: `http://localhost:3000/api/stripe/test-webhook`

**Resposta esperada:**

```json
{
  "message": "Webhook test endpoint is working",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development",
  "stripeKeyConfigured": true,
  "webhookSecretConfigured": true
}
```

### 4. Verificar Logs do Webhook

1. **Faça um pagamento de teste** com cartão de teste
2. **Verifique o console** do servidor para logs do webhook
3. **Procure por logs** como:
   ```
   === WEBHOOK RECEIVED ===
   ✅ Stripe signature found: whsec_...
   🎯 Event type: checkout.session.completed
   🔄 Processing checkout.session.completed
   ```

### 5. Testar Webhook Manualmente

No Stripe Dashboard > Webhooks:

1. Clique no seu webhook
2. Clique em "Send test webhook"
3. Selecione "checkout.session.completed"
4. Clique em "Send test webhook"
5. Verifique os logs do servidor

### 6. Verificar Banco de Dados

Confirme que os pedidos existem no banco:

```sql
SELECT id, status, "createdAt" FROM "order" ORDER BY "createdAt" DESC LIMIT 5;
```

### 7. Testar Verificação Manual

1. Vá para `/my-orders`
2. Clique no botão de refresh (🔄) ao lado de um pedido pendente
3. Verifique se o status muda para "Pago"

## 🐛 Problemas Comuns e Soluções

### Problema: "Webhook signature verification failed"

**Solução:** Verificar se `STRIPE_WEBHOOK_SECRET` está correto

### Problema: "No orderId in session metadata"

**Solução:** Verificar se o `orderId` está sendo passado na criação da sessão

### Problema: "Order not found in database"

**Solução:** Verificar se o pedido foi criado corretamente

### Problema: Webhook não recebido

**Soluções:**

1. Verificar se a URL está acessível publicamente
2. Usar ngrok para desenvolvimento local
3. Verificar firewall/antivírus

## 🧪 Teste Completo

### 1. Criar Pedido de Teste

1. Adicione produtos ao carrinho
2. Finalize o pedido
3. Use cartão de teste: `4242 4242 4242 4242`
4. Complete o pagamento

### 2. Verificar Webhook

1. Console deve mostrar logs detalhados
2. Pedido deve ser atualizado para "paid"

### 3. Verificar Interface

1. Vá para `/my-orders`
2. Pedido deve aparecer como "Pago"

## 📞 Próximos Passos

Se o problema persistir:

1. **Compartilhe os logs** do console
2. **Verifique se o webhook** está sendo enviado no Stripe Dashboard
3. **Confirme se as variáveis** de ambiente estão corretas
4. **Teste com ngrok** se estiver em desenvolvimento local

## 🔧 Comandos Úteis

### Testar Webhook Localmente

```bash
# Instalar Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Em outro terminal, fazer pagamento de teste
```

### Verificar Logs

```bash
# Se estiver usando npm
npm run dev

# Verificar console para logs do webhook
```
