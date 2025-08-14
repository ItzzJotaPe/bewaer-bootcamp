import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import {
  orderItemTable,
  orderTable,
  productTable,
  productVariantTable,
  userTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";

type OrderItem = {
  id: string;
  quantity: number;
  priceInCents: number;
  productVariant: {
    id: string;
    name: string;
    color: string;
    product: {
      id: string;
      name: string;
    };
  };
};

type OrderWithItems = {
  id: string;
  status: string;
  totalPriceInCents: number;
  createdAt: Date;
  recipientName: string;
  email: string;
  phone: string;
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  items: OrderItem[];
};

export default async function AdminOrdersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/authentication");
  }

  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, session.user.id))
    .limit(1);

  if (!user.length || user[0].role !== "adm") {
    redirect("/");
  }

  const orders = await db
    .select({
      id: orderTable.id,
      status: orderTable.status,
      totalPriceInCents: orderTable.totalPriceInCents,
      createdAt: orderTable.createdAt,
      recipientName: orderTable.recipientName,
      email: orderTable.email,
      phone: orderTable.phone,
      street: orderTable.street,
      number: orderTable.number,
      city: orderTable.city,
      state: orderTable.state,
      zipCode: orderTable.zipCode,
      country: orderTable.country,
    })
    .from(orderTable);

  const ordersWithItems: OrderWithItems[] = await Promise.all(
    orders.map(async (order) => {
      const itemsResult = await db
        .select({
          id: orderItemTable.id,
          quantity: orderItemTable.quantity,
          priceInCents: orderItemTable.priceInCents,
          productVariantId: orderItemTable.productVariantId,
        })
        .from(orderItemTable)
        .where(eq(orderItemTable.orderId, order.id));

      const items: OrderItem[] = await Promise.all(
        itemsResult.map(async (item) => {
          const variant = await db
            .select({
              id: productVariantTable.id,
              name: productVariantTable.name,
              color: productVariantTable.color,
              productId: productVariantTable.productId,
            })
            .from(productVariantTable)
            .where(eq(productVariantTable.id, item.productVariantId))
            .limit(1);

          if (!variant.length) {
            throw new Error(
              `Product variant not found: ${item.productVariantId}`,
            );
          }

          const product = await db
            .select({
              id: productTable.id,
              name: productTable.name,
            })
            .from(productTable)
            .where(eq(productTable.id, variant[0].productId))
            .limit(1);

          if (!product.length) {
            throw new Error(`Product not found: ${variant[0].productId}`);
          }

          return {
            id: item.id,
            quantity: item.quantity,
            priceInCents: item.priceInCents,
            productVariant: {
              id: variant[0].id,
              name: variant[0].name,
              color: variant[0].color,
              product: {
                id: product[0].id,
                name: product[0].name,
              },
            },
          };
        }),
      );

      return {
        ...order,
        items,
      };
    }),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "paid":
        return "Pago";
      case "canceled":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Visualizar Pedidos</h1>
        <a
          href="/admin"
          className="rounded-md bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
        >
          Voltar ao Painel
        </a>
      </div>

      <div className="space-y-6">
        {ordersWithItems.map((order) => (
          <div
            key={order.id}
            className="rounded-lg border bg-white p-6 shadow-md"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="mb-2 flex items-center gap-4">
                  <h2 className="text-xl font-semibold">
                    Pedido #{order.id.slice(0, 8)}
                  </h2>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(order.status)}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 md:grid-cols-2">
                  <div>
                    <p>
                      <strong>Cliente:</strong> {order.recipientName}
                    </p>
                    <p>
                      <strong>Email:</strong> {order.email}
                    </p>
                    <p>
                      <strong>Telefone:</strong> {order.phone}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Endereço:</strong> {order.street}, {order.number}
                    </p>
                    <p>
                      <strong>Cidade:</strong> {order.city} - {order.state}
                    </p>
                    <p>
                      <strong>CEP:</strong> {order.zipCode}
                    </p>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <p>
                    Criado em:{" "}
                    {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                  <p>Total: R$ {(order.totalPriceInCents / 100).toFixed(2)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700">
                  Ver Detalhes
                </button>
                <button className="rounded-md bg-green-600 px-3 py-1 text-sm text-white transition-colors hover:bg-green-700">
                  Atualizar Status
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 font-semibold">
                Itens do Pedido ({order.items.length})
              </h3>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div>
                      <p className="font-medium">
                        {item.productVariant.product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.productVariant.name} - {item.productVariant.color}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Qtd: {item.quantity}</p>
                      <p className="text-sm text-gray-600">
                        R$ {(item.priceInCents / 100).toFixed(2)} cada
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {ordersWithItems.length === 0 && (
          <div className="rounded-lg border bg-white p-8 text-center">
            <h3 className="mb-2 text-lg font-semibold">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-600">Ainda não há pedidos no sistema</p>
          </div>
        )}
      </div>
    </div>
  );
}
