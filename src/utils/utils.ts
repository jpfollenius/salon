export function formatPrice(price: number): string {
    return (Math.round(price * 100) / 100).toString()
}