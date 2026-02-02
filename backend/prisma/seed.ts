import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg(process.env['DATABASE_URL']!);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1. Currencies
  const currencies = [
    {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      symbolNative: '$',
      decimalDigits: 2,
    },
    {
      code: 'EUR',
      name: 'Euro',
      symbol: '\u20AC',
      symbolNative: '\u20AC',
      decimalDigits: 2,
    },
    {
      code: 'GBP',
      name: 'British Pound',
      symbol: '\u00A3',
      symbolNative: '\u00A3',
      decimalDigits: 2,
    },
    {
      code: 'JPY',
      name: 'Japanese Yen',
      symbol: '\u00A5',
      symbolNative: '\uFFE5',
      decimalDigits: 0,
    },
    {
      code: 'CAD',
      name: 'Canadian Dollar',
      symbol: 'CA$',
      symbolNative: '$',
      decimalDigits: 2,
    },
    {
      code: 'AUD',
      name: 'Australian Dollar',
      symbol: 'A$',
      symbolNative: '$',
      decimalDigits: 2,
    },
  ];
  for (const c of currencies) {
    await prisma.currency.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }
  console.log(`  Created ${currencies.length} currencies`);

  // 2. Regions
  const naRegion = await prisma.region.upsert({
    where: { name: 'North America' },
    update: {},
    create: {
      name: 'North America',
      currencyCode: 'USD',
      taxInclusivePricing: false,
    },
  });
  const euRegion = await prisma.region.upsert({
    where: { name: 'Europe' },
    update: {},
    create: {
      name: 'Europe',
      currencyCode: 'EUR',
      taxInclusivePricing: true,
    },
  });
  console.log('  Created 2 regions');

  // 3. Region countries
  const naCountries = ['US', 'CA'];
  const euCountries = ['GB', 'DE', 'FR', 'IT', 'ES', 'NL'];
  for (const code of naCountries) {
    await prisma.regionCountry.upsert({
      where: {
        regionId_countryCode: { regionId: naRegion.id, countryCode: code },
      },
      update: {},
      create: { regionId: naRegion.id, countryCode: code },
    });
  }
  for (const code of euCountries) {
    await prisma.regionCountry.upsert({
      where: {
        regionId_countryCode: { regionId: euRegion.id, countryCode: code },
      },
      update: {},
      create: { regionId: euRegion.id, countryCode: code },
    });
  }
  console.log('  Created region countries');

  // 4. Tax rates
  await prisma.taxRate.upsert({
    where: { id: 'seed-tax-na' },
    update: {},
    create: {
      id: 'seed-tax-na',
      regionId: naRegion.id,
      name: 'US Sales Tax',
      rate: 0.08,
      isDefault: true,
    },
  });
  await prisma.taxRate.upsert({
    where: { id: 'seed-tax-eu' },
    update: {},
    create: {
      id: 'seed-tax-eu',
      regionId: euRegion.id,
      name: 'EU VAT',
      rate: 0.2,
      isDefault: true,
    },
  });
  console.log('  Created 2 tax rates');

  // 5. Sales channels
  await prisma.salesChannel.upsert({
    where: { name: 'Web Store' },
    update: {},
    create: { name: 'Web Store', type: 'WEB', isActive: true },
  });
  await prisma.salesChannel.upsert({
    where: { name: 'Mobile App' },
    update: {},
    create: { name: 'Mobile App', type: 'MOBILE', isActive: true },
  });
  console.log('  Created 2 sales channels');

  // 6. Shipping methods
  await prisma.shippingMethod
    .create({
      data: {
        regionId: naRegion.id,
        name: 'Standard Shipping',
        price: 5.99,
        isActive: true,
      },
    })
    .catch(() => {
      /* ignore duplicate */
    });
  await prisma.shippingMethod
    .create({
      data: {
        regionId: naRegion.id,
        name: 'Express Shipping',
        price: 14.99,
        isActive: true,
      },
    })
    .catch(() => {
      /* ignore duplicate */
    });
  await prisma.shippingMethod
    .create({
      data: {
        regionId: euRegion.id,
        name: 'EU Standard Shipping',
        price: 7.99,
        isActive: true,
      },
    })
    .catch(() => {
      /* ignore duplicate */
    });
  console.log('  Created shipping methods');

  // 7. Stock locations
  const warehouse = await prisma.stockLocation.upsert({
    where: { code: 'WH-01' },
    update: {},
    create: {
      name: 'Main Warehouse',
      code: 'WH-01',
      city: 'New York',
      state: 'NY',
      countryCode: 'US',
      isActive: true,
    },
  });
  console.log('  Created stock location');

  // 8. Admin user
  const passwordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@npc-commerce.com' },
    update: {},
    create: {
      email: 'admin@npc-commerce.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log('  Created admin user (admin@npc-commerce.com / admin123)');

  // 9. Sample customer
  const customerPasswordHash = await bcrypt.hash('customer123', 10);
  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      passwordHash: customerPasswordHash,
      firstName: 'John',
      lastName: 'Doe',
      role: 'CUSTOMER',
      isActive: true,
    },
  });
  await prisma.customer.upsert({
    where: { userId: customerUser.id },
    update: {},
    create: { userId: customerUser.id, phone: '+1234567890' },
  });
  console.log('  Created sample customer (customer@example.com / customer123)');

  // 10. Sample products
  const products = [
    {
      title: 'Classic T-Shirt',
      slug: 'classic-t-shirt',
      description:
        'A comfortable classic cotton t-shirt available in multiple sizes and colors.',
      status: 'PUBLISHED' as const,
      variants: [
        { title: 'Small / White', sku: 'TSH-S-WHT', price: 29.99 },
        { title: 'Medium / White', sku: 'TSH-M-WHT', price: 29.99 },
        { title: 'Large / White', sku: 'TSH-L-WHT', price: 29.99 },
        { title: 'Small / Black', sku: 'TSH-S-BLK', price: 29.99 },
        { title: 'Medium / Black', sku: 'TSH-M-BLK', price: 29.99 },
        { title: 'Large / Black', sku: 'TSH-L-BLK', price: 29.99 },
      ],
    },
    {
      title: 'Premium Hoodie',
      slug: 'premium-hoodie',
      description: 'A premium heavyweight hoodie with kangaroo pocket.',
      status: 'PUBLISHED' as const,
      variants: [
        { title: 'Small', sku: 'HOD-S', price: 79.99 },
        { title: 'Medium', sku: 'HOD-M', price: 79.99 },
        { title: 'Large', sku: 'HOD-L', price: 79.99 },
        { title: 'XL', sku: 'HOD-XL', price: 84.99 },
      ],
    },
    {
      title: 'Running Sneakers',
      slug: 'running-sneakers',
      description: 'Lightweight running sneakers with responsive cushioning.',
      status: 'PUBLISHED' as const,
      variants: [
        { title: 'US 8', sku: 'SNK-8', price: 129.99 },
        { title: 'US 9', sku: 'SNK-9', price: 129.99 },
        { title: 'US 10', sku: 'SNK-10', price: 129.99 },
        { title: 'US 11', sku: 'SNK-11', price: 129.99 },
        { title: 'US 12', sku: 'SNK-12', price: 129.99 },
      ],
    },
    {
      title: 'Leather Wallet',
      slug: 'leather-wallet',
      description: 'Genuine leather bifold wallet with RFID protection.',
      status: 'PUBLISHED' as const,
      variants: [
        { title: 'Brown', sku: 'WLT-BRN', price: 49.99 },
        { title: 'Black', sku: 'WLT-BLK', price: 49.99 },
      ],
    },
    {
      title: 'Wireless Earbuds',
      slug: 'wireless-earbuds',
      description:
        'True wireless earbuds with active noise cancellation and 24h battery life.',
      status: 'PUBLISHED' as const,
      variants: [{ title: 'Default', sku: 'EBD-001', price: 199.99 }],
    },
  ];

  for (const p of products) {
    const existing = await prisma.product.findUnique({
      where: { slug: p.slug },
    });
    if (existing) continue;

    const product = await prisma.product.create({
      data: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        status: p.status,
      },
    });

    for (let i = 0; i < p.variants.length; i++) {
      const v = p.variants[i];
      const variant = await prisma.productVariant.create({
        data: {
          productId: product.id,
          title: v.title,
          sku: v.sku,
          price: v.price,
          position: i,
        },
      });

      // Create inventory level
      await prisma.inventoryLevel.create({
        data: {
          variantId: variant.id,
          stockLocationId: warehouse.id,
          onHand: 100,
          available: 100,
          lowStockThreshold: 10,
        },
      });
    }
  }
  console.log(
    `  Created ${products.length} sample products with variants and inventory`,
  );

  // 11. Categories
  const categories = ['Clothing', 'Footwear', 'Accessories', 'Electronics'];
  for (const name of categories) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug, isActive: true },
    });
  }
  console.log(`  Created ${categories.length} categories`);

  // 12. Sample promotion
  await prisma.promotion
    .create({
      data: {
        code: 'WELCOME10',
        name: 'Welcome 10% Off',
        description: '10% off for new customers',
        type: 'PERCENTAGE',
        value: 10,
        usageLimit: 1000,
        perCustomerLimit: 1,
        isActive: true,
        startsAt: new Date(),
        endsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    })
    .catch(() => {
      /* ignore duplicate */
    });
  console.log('  Created sample promotion (WELCOME10)');

  console.log('\nSeed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
