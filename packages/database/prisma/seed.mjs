import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const accessories = await prisma.category.upsert({
    where: { slug: "luxury-accessories" },
    update: {},
    create: {
      name: "Luxury Accessories",
      slug: "luxury-accessories",
    },
  });

  const electronics = await prisma.category.upsert({
    where: { slug: "high-end-electronics" },
    update: {},
    create: {
      name: "High-End Electronics",
      slug: "high-end-electronics",
    },
  });

  const fashion = await prisma.category.upsert({
    where: { slug: "luxury-fashion" },
    update: {},
    create: {
      name: "Luxury Fashion",
      slug: "luxury-fashion",
    },
  });

  const maisonVelluto = await prisma.brand.upsert({
    where: { slug: "maison-velluto" },
    update: {},
    create: {
      name: "Maison Velluto",
      slug: "maison-velluto",
    },
  });

  const atelierChronos = await prisma.brand.upsert({
    where: { slug: "atelier-chronos" },
    update: {},
    create: {
      name: "Atelier Chronos",
      slug: "atelier-chronos",
    },
  });

  const casaAurelia = await prisma.brand.upsert({
    where: { slug: "casa-aurelia" },
    update: {},
    create: {
      name: "Casa Aurelia",
      slug: "casa-aurelia",
    },
  });

  const nobleAcoustics = await prisma.brand.upsert({
    where: { slug: "noble-acoustics" },
    update: {},
    create: {
      name: "Noble Acoustics",
      slug: "noble-acoustics",
    },
  });

  await prisma.product.upsert({
    where: { sku: "LUX-BAG-001" },
    update: {},
    create: {
      sku: "LUX-BAG-001",
      name: "Noir Leather Travel Bag",
      slug: "noir-leather-travel-bag",
      brandId: maisonVelluto.id,
      categoryId: accessories.id,
      basePrice: 1250,
      comparePrice: 1490,
      currency: "USD",
      shortDescription: "A refined full-grain leather travel piece crafted for modern movement.",
      description:
        "Designed for weekend escapes and executive travel, this leather bag combines architectural structure, soft-touch finishing, and carefully appointed internal compartments.",
      materials: ["Full-grain Italian leather", "Suede-lined interior", "Brass hardware"],
      features: ["Cabin-friendly profile", "Detachable shoulder strap", "Internal laptop sleeve"],
      images: ["/products/noir-bag-1.jpg", "/products/noir-bag-2.jpg"],
      has360Viewer: true,
      stock: 8,
      status: "ACTIVE",
    },
  });

  await prisma.product.upsert({
    where: { sku: "LUX-WATCH-001" },
    update: {},
    create: {
      sku: "LUX-WATCH-001",
      name: "Signature Chronograph Watch",
      slug: "signature-chronograph-watch",
      brandId: atelierChronos.id,
      categoryId: electronics.id,
      basePrice: 2800,
      currency: "USD",
      shortDescription: "A precision chronograph with modern engineering and timeless restraint.",
      description:
        "This chronograph blends sapphire crystal, brushed titanium, and intelligent timekeeping details for collectors who value precision and quiet luxury.",
      materials: ["Brushed titanium", "Sapphire crystal", "Italian leather strap"],
      features: ["Water resistant", "Precision movement", "Interchangeable strap system"],
      images: ["/products/chronograph-1.jpg", "/products/chronograph-2.jpg"],
      has360Viewer: true,
      stock: 5,
      status: "ACTIVE",
    },
  });

  await prisma.product.upsert({
    where: { sku: "LUX-COAT-001" },
    update: {},
    create: {
      sku: "LUX-COAT-001",
      name: "Italian Wool Evening Coat",
      slug: "italian-wool-evening-coat",
      brandId: casaAurelia.id,
      categoryId: fashion.id,
      basePrice: 1950,
      currency: "USD",
      shortDescription: "A sculpted wool coat created for evening wear and winter refinement.",
      description:
        "Cut from premium Italian wool, this evening coat is tailored with a relaxed architectural silhouette, satin interior finishing, and understated gold detailing.",
      materials: ["Italian wool", "Satin lining", "Horn buttons"],
      features: ["Relaxed tailored fit", "Internal secure pocket", "Limited seasonal release"],
      images: ["/products/wool-coat-1.jpg", "/products/wool-coat-2.jpg"],
      has360Viewer: false,
      stock: 12,
      status: "ACTIVE",
    },
  });

  await prisma.product.upsert({
    where: { sku: "LUX-AUDIO-001" },
    update: {},
    create: {
      sku: "LUX-AUDIO-001",
      name: "Obsidian Wireless Audio System",
      slug: "obsidian-wireless-audio-system",
      brandId: nobleAcoustics.id,
      categoryId: electronics.id,
      basePrice: 3400,
      currency: "USD",
      shortDescription: "A sculptural wireless audio system built for immersive private listening.",
      description:
        "Created for design-led interiors, this high-fidelity audio system delivers powerful spatial sound through a minimal obsidian-inspired form.",
      materials: ["Anodized aluminium", "Acoustic mesh", "Ceramic control dial"],
      features: ["Spatial audio", "Multi-room pairing", "Low-latency wireless connection"],
      images: ["/products/audio-system-1.jpg", "/products/audio-system-2.jpg"],
      has360Viewer: true,
      stock: 4,
      status: "ACTIVE",
    },
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
