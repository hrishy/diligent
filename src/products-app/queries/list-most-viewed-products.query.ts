export class ListMostViewedProductsQuery {
  constructor(
    public readonly limit?: number,
    public readonly currency?: string,
  ) {}
}
