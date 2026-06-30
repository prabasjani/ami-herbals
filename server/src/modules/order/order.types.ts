export enum OrderStatus {
  PENDING = "pending",

  PROCESSING = "processing",

  CONFIRMED = "confirmed",

  PACKED = "packed",

  SHIPPED = "shipped",

  OUT_FOR_DELIVERY = "out_for_delivery",

  DELIVERED = "delivered",

  CANCELLED = "cancelled",
}

export enum PaymentMethod {
  COD = "cod",
}

export enum PaymentStatus {
  PENDING = "pending",

  PAID = "paid",

  FAILED = "failed",

  REFUNDED = "refunded",
}
