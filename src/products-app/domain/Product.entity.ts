import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: false })
  deleted: boolean;

  static create({
    name,
    price,
    description,
  }: {
    name: string;
    price: number;
    description?: string;
  }): Product {
    const product = new Product();
    product.name = name;
    product.price = price;
    product.description = description;
    product.viewCount = 0;
    product.deleted = false;
    return product;
  }
}
