/**
 * Catalog source: WELTORQUE technical catalogue (Weltorque cat.pdf, 41 pages).
 * Exactly 41 products — one per PDF page — with the exact technical description,
 * specification table, "Common applications" list and the original page image.
 * Prices / MOQ / stock are the acting catalogue values used by COD checkout; the PDF contains no commercial data.
 */
export type Product = {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: string; // category id
  shortDescription: string;
  fullDescription: string;
  material: string;
  grade: string;
  finish: string;
  diameter: string;
  length: string;
  threadType: string;
  threadPitch: string;
  standard: string;
  strength: string;
  propertyClass: string;
  fastenerType: string;
  remark: string;
  availableSizes: string[];
  price: number | null; // null = quote-only
  currency: string;
  moq: number;
  stockStatus: 'in-stock' | 'low-stock' | 'made-to-order' | 'quote-only';
  images: string[];
  modelPath: string | null;
  specs: { label: string; value: string }[];
  related: string[];
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  sample: boolean;
  featured: boolean;
  /** Page number in the supplied WELTORQUE catalogue (PDF-sourced products only). */
  catalogPage?: number;
  /** Intro paragraph that appears before the technical description in the PDF. */
  catalogIntro?: string;
  /** "Common applications" bullet list from the PDF. */
  applications?: string[];
};

export const products: Product[] = [
  {
    "id": "e01",
    "sku": "SHCS-M2X10",
    "name": "M2 SHCS × 10 mm",
    "slug": "m2-shcs-10",
    "category": "m2-fasteners",
    "shortDescription": "M2 SHCS × 10 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M2x10 SHCS is a precision metric fastener with a nominal thread diameter of 2 mm and a length of 10 mm, measured from the underside of the head to the tip. It is designed for secure fastening in compact mechanical assemblies where accurate positioning, reliable clamping force, and limited installation space are required.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M2",
    "length": "10 mm",
    "threadType": "Metric coarse",
    "threadPitch": "0.4 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M2 × 10"
    ],
    "price": 4.5,
    "currency": "INR",
    "moq": 500,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m2x10.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M2 (2 mm)"
      },
      {
        "label": "Length",
        "value": "10 mm"
      },
      {
        "label": "Thread pitch",
        "value": "0.4 mm"
      },
      {
        "label": "Head diameter",
        "value": "4.0 mm"
      },
      {
        "label": "Head height",
        "value": "2.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "1.5 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e02",
      "e03",
      "e04"
    ],
    "seoTitle": "M2 SHCS × 10 mm | WELTOQ",
    "seoDescription": "M2 SHCS × 10 mm · ISO 4762 / DIN 912. A Standard M2x10 SHCS is a precision metric fastener with a nominal thread diameter of 2 mm and a length of 10 mm, measured from the underside of the head to th…",
    "keywords": [
      "M2",
      "m2 shcs × 10 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": true,
    "catalogPage": 1,
    "catalogIntro": "SHCS stands for Socket Head Cap Screw. It is a metric threaded fastener featuring a cylindrical head and internal hexagonal (Allen) drive.",
    "applications": [
      "Precision engineering assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and miniature mechanisms",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e02",
    "sku": "SHCS-M2X12",
    "name": "M2 SHCS × 12 mm",
    "slug": "m2-shcs-12",
    "category": "m2-fasteners",
    "shortDescription": "M2 SHCS × 12 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M2×12 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 2 mm and a length of 12 mm, measured from the underside of the head to the tip. It provides reliable clamping force and is suitable for compact mechanical assemblies requiring precision fastening.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M2",
    "length": "12 mm",
    "threadType": "Metric coarse",
    "threadPitch": "0.4 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M2 × 12"
    ],
    "price": 4.8,
    "currency": "INR",
    "moq": 500,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m2x12.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M2 (2 mm)"
      },
      {
        "label": "Length",
        "value": "12 mm"
      },
      {
        "label": "Thread pitch",
        "value": "0.4 mm"
      },
      {
        "label": "Head diameter",
        "value": "4.0 mm"
      },
      {
        "label": "Head height",
        "value": "2.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "1.5 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e01",
      "e03",
      "e04"
    ],
    "seoTitle": "M2 SHCS × 12 mm | WELTOQ",
    "seoDescription": "M2 SHCS × 12 mm · ISO 4762 / DIN 912. A Standard M2×12 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M2",
      "m2 shcs × 12 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 2,
    "applications": [
      "Precision engineering assemblies",
      "Electronic equipment and enclosures",
      "Robotics and automation systems",
      "3D printers and miniature mechanisms",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e03",
    "sku": "SHCS-M2X16",
    "name": "M2 SHCS × 16 mm",
    "slug": "m2-shcs-16",
    "category": "m2-fasteners",
    "shortDescription": "M2 SHCS × 16 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M2×16 SHCS (Socket Head Cap Screw) is a metric fastener with a cylindrical head and internal hexagonal (Allen) drive. It features a nominal thread diameter of 2 mm and a thread length of 16 mm, measured from the underside of the head to the tip. It is designed for secure fastening in precision mechanical assemblies, particularly where compact dimensions and reliable clamping force are required.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M2",
    "length": "16 mm",
    "threadType": "Metric coarse",
    "threadPitch": "0.4 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M2 × 16"
    ],
    "price": 5.4,
    "currency": "INR",
    "moq": 500,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m2x16.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M2 (2 mm)"
      },
      {
        "label": "Length",
        "value": "16 mm"
      },
      {
        "label": "Thread pitch",
        "value": "0.4 mm"
      },
      {
        "label": "Head diameter",
        "value": "4.0 mm"
      },
      {
        "label": "Head height",
        "value": "2.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "1.5 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e01",
      "e02",
      "e04"
    ],
    "seoTitle": "M2 SHCS × 16 mm | WELTOQ",
    "seoDescription": "M2 SHCS × 16 mm · ISO 4762 / DIN 912. A Standard M2×16 SHCS (Socket Head Cap Screw) is a metric fastener with a cylindrical head and internal hexagonal (Allen) drive. It features a nominal thread di…",
    "keywords": [
      "M2",
      "m2 shcs × 16 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 3,
    "applications": [
      "Precision engineering assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and miniature mechanisms",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e04",
    "sku": "NUT-M2",
    "name": "M2 NUTS",
    "slug": "m2-nuts",
    "category": "m2-fasteners",
    "shortDescription": "M2 NUTS · ISO 4032 / DIN 934",
    "fullDescription": "A Standard M2 Hex Nut is a metric, six-sided threaded fastener designed to mate with an M2 screw or bolt. It features an internal metric thread and six external flat sides for tightening with a suitable wrench or spanner. It provides a reliable fastening solution for securing components in compact mechanical assemblies, electronics, robotics, and precision engineering applications.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M2",
    "length": "—",
    "threadType": "Metric coarse",
    "threadPitch": "0.4 mm",
    "standard": "ISO 4032 / DIN 934",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Standard Hex Nut",
    "remark": "—",
    "availableSizes": [
      "M2"
    ],
    "price": 2.5,
    "currency": "INR",
    "moq": 500,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/hex-nut-m2.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Standard Hex Nut"
      },
      {
        "label": "Standard",
        "value": "ISO 4032 / DIN 934"
      },
      {
        "label": "Thread size",
        "value": "M2 (2 mm)"
      },
      {
        "label": "Thread pitch",
        "value": "0.4 mm"
      },
      {
        "label": "Across flats",
        "value": "4.0 mm"
      },
      {
        "label": "Nut thickness",
        "value": "1.6 mm"
      },
      {
        "label": "Nut type",
        "value": "Hex Nut (Full Nut)"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e01",
      "e02",
      "e03"
    ],
    "seoTitle": "M2 NUTS | WELTOQ",
    "seoDescription": "M2 NUTS · ISO 4032 / DIN 934. A Standard M2 Hex Nut is a metric, six-sided threaded fastener designed to mate with an M2 screw or bolt. It features an internal metric thread and six external…",
    "keywords": [
      "M2",
      "m2 nuts",
      "din-934",
      "fastener",
      "Standard Hex Nut",
      "ISO 4032 / DIN 934",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 37,
    "applications": [
      "Securing M2 screws and bolts",
      "Compact mechanical assemblies",
      "Electronics and small enclosures",
      "Robotics, drones, and miniature mechanisms",
      "3D printers and precision equipment"
    ]
  },
  {
    "id": "e06",
    "sku": "SHCS-M3X10",
    "name": "M3 SHCS × 10 mm",
    "slug": "m3-shcs-10",
    "category": "m3-fasteners",
    "shortDescription": "M3 SHCS × 10 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M3×10 SHCS (Socket Head Cap Screw) is a metric fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 3 mm and a length of 10 mm, measured from the underside of the head to the tip. It provides reliable clamping force and is widely used in mechanical assemblies, machinery, electronics, and precision engineering applications.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M3",
    "length": "10 mm",
    "threadType": "Metric coarse",
    "threadPitch": "0.5 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M3 × 10"
    ],
    "price": 5.2,
    "currency": "INR",
    "moq": 500,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m3x10.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M3 (3 mm)"
      },
      {
        "label": "Length",
        "value": "10 mm"
      },
      {
        "label": "Thread pitch",
        "value": "0.5 mm"
      },
      {
        "label": "Head diameter",
        "value": "5.5 mm"
      },
      {
        "label": "Head height",
        "value": "3.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "2.5 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e07",
      "e08",
      "e09"
    ],
    "seoTitle": "M3 SHCS × 10 mm | WELTOQ",
    "seoDescription": "M3 SHCS × 10 mm · ISO 4762 / DIN 912. A Standard M3×10 SHCS (Socket Head Cap Screw) is a metric fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal threa…",
    "keywords": [
      "M3",
      "m3 shcs × 10 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 4,
    "applications": [
      "General mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e07",
    "sku": "SHCS-M3X12",
    "name": "M3 SHCS × 12 mm",
    "slug": "m3-shcs-12",
    "category": "m3-fasteners",
    "shortDescription": "M3 SHCS × 12 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M3×12 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 3 mm and a length of 12 mm, measured from the underside of the head to the tip. It provides reliable clamping force and is suitable for mechanical assemblies requiring secure fastening, precision alignment, and durability.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M3",
    "length": "12 mm",
    "threadType": "Metric coarse",
    "threadPitch": "0.5 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M3 × 12"
    ],
    "price": 5.5,
    "currency": "INR",
    "moq": 500,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m3x12.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M3 (3 mm)"
      },
      {
        "label": "Length",
        "value": "12 mm"
      },
      {
        "label": "Thread pitch",
        "value": "0.5 mm"
      },
      {
        "label": "Head diameter",
        "value": "5.5 mm"
      },
      {
        "label": "Head height",
        "value": "3.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "2.5 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e06",
      "e08",
      "e09"
    ],
    "seoTitle": "M3 SHCS × 12 mm | WELTOQ",
    "seoDescription": "M3 SHCS × 12 mm · ISO 4762 / DIN 912. A Standard M3×12 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M3",
      "m3 shcs × 12 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 5,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e08",
    "sku": "SHCS-M3X16",
    "name": "M3 SHCS × 16 mm",
    "slug": "m3-shcs-16",
    "category": "m3-fasteners",
    "shortDescription": "M3 SHCS × 16 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M3×16 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 3 mm and a length of 16 mm, measured from the underside of the head to the tip. It provides reliable clamping force and is suitable for mechanical assemblies requiring secure fastening, precision alignment, and durability.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M3",
    "length": "16 mm",
    "threadType": "Metric coarse",
    "threadPitch": "0.5 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M3 × 16"
    ],
    "price": 6.1,
    "currency": "INR",
    "moq": 500,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m3x16.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M3 (3 mm)"
      },
      {
        "label": "Length",
        "value": "16 mm"
      },
      {
        "label": "Thread pitch",
        "value": "0.5 mm"
      },
      {
        "label": "Head diameter",
        "value": "5.5 mm"
      },
      {
        "label": "Head height",
        "value": "3.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "2.5 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e06",
      "e07",
      "e09"
    ],
    "seoTitle": "M3 SHCS × 16 mm | WELTOQ",
    "seoDescription": "M3 SHCS × 16 mm · ISO 4762 / DIN 912. A Standard M3×16 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M3",
      "m3 shcs × 16 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": true,
    "catalogPage": 6,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e09",
    "sku": "SHCS-M3X20",
    "name": "M3 SHCS × 20 mm",
    "slug": "m3-shcs-20",
    "category": "m3-fasteners",
    "shortDescription": "M3 SHCS × 20 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M3×20 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 3 mm and a length of 20 mm, measured from the underside of the head to the tip. It provides secure clamping force and is suitable for mechanical assemblies requiring reliable fastening, precision alignment, and structural stability.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M3",
    "length": "20 mm",
    "threadType": "Metric coarse",
    "threadPitch": "0.5 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M3 × 20"
    ],
    "price": 6.7,
    "currency": "INR",
    "moq": 500,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m3x20.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M3 (3 mm)"
      },
      {
        "label": "Length",
        "value": "20 mm"
      },
      {
        "label": "Thread pitch",
        "value": "0.5 mm"
      },
      {
        "label": "Head diameter",
        "value": "5.5 mm"
      },
      {
        "label": "Head height",
        "value": "3.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "2.5 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e06",
      "e07",
      "e08"
    ],
    "seoTitle": "M3 SHCS × 20 mm | WELTOQ",
    "seoDescription": "M3 SHCS × 20 mm · ISO 4762 / DIN 912. A Standard M3×20 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M3",
      "m3 shcs × 20 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 7,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e10",
    "sku": "SHCS-M3X25",
    "name": "M3 SHCS × 25 mm",
    "slug": "m3-shcs-25",
    "category": "m3-fasteners",
    "shortDescription": "M3 SHCS × 25 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M3×25 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 3 mm and a length of 25 mm, measured from the underside of the head to the tip. It is designed to provide secure clamping force and reliable fastening in mechanical assemblies, particularly where longer thread engagement is required.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M3",
    "length": "25 mm",
    "threadType": "Metric coarse",
    "threadPitch": "0.5 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M3 × 25"
    ],
    "price": 7.5,
    "currency": "INR",
    "moq": 500,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m3x25.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M3 (3 mm)"
      },
      {
        "label": "Length",
        "value": "25 mm"
      },
      {
        "label": "Thread pitch",
        "value": "0.5 mm"
      },
      {
        "label": "Head diameter",
        "value": "5.5 mm"
      },
      {
        "label": "Head height",
        "value": "3.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "2.5 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e06",
      "e07",
      "e08"
    ],
    "seoTitle": "M3 SHCS × 25 mm | WELTOQ",
    "seoDescription": "M3 SHCS × 25 mm · ISO 4762 / DIN 912. A Standard M3×25 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M3",
      "m3 shcs × 25 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 8,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e11",
    "sku": "SHCS-M3X30",
    "name": "M3 SHCS × 30 mm",
    "slug": "m3-shcs-30",
    "category": "m3-fasteners",
    "shortDescription": "M3 SHCS × 30 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M3×30 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 3 mm and a length of 30 mm, measured from the underside of the head to the tip. It is designed to provide secure clamping force and reliable fastening in mechanical assemblies, particularly where longer thread engagement is required.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M3",
    "length": "30 mm",
    "threadType": "Metric coarse",
    "threadPitch": "0.5 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M3 × 30"
    ],
    "price": 8.2,
    "currency": "INR",
    "moq": 500,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m3x30.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M3 (3 mm)"
      },
      {
        "label": "Length",
        "value": "30 mm"
      },
      {
        "label": "Thread pitch",
        "value": "0.5 mm"
      },
      {
        "label": "Head diameter",
        "value": "5.5 mm"
      },
      {
        "label": "Head height",
        "value": "3.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "2.5 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e06",
      "e07",
      "e08"
    ],
    "seoTitle": "M3 SHCS × 30 mm | WELTOQ",
    "seoDescription": "M3 SHCS × 30 mm · ISO 4762 / DIN 912. A Standard M3×30 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M3",
      "m3 shcs × 30 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 9,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e12",
    "sku": "SHCS-M3X35",
    "name": "M3 SHCS × 35 mm",
    "slug": "m3-shcs-35",
    "category": "m3-fasteners",
    "shortDescription": "M3 SHCS × 35 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M3×35 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 3 mm and a length of 35 mm, measured from the underside of the head to the tip. It is designed for secure fastening in mechanical assemblies where longer thread engagement and reliable clamping force are required.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M3",
    "length": "35 mm",
    "threadType": "Metric coarse",
    "threadPitch": "0.5 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M3 × 35"
    ],
    "price": 8.9,
    "currency": "INR",
    "moq": 500,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m3x35.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M3 (3 mm)"
      },
      {
        "label": "Length",
        "value": "35 mm"
      },
      {
        "label": "Thread pitch",
        "value": "0.5 mm"
      },
      {
        "label": "Head diameter",
        "value": "5.5 mm"
      },
      {
        "label": "Head height",
        "value": "3.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "2.5 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e06",
      "e07",
      "e08"
    ],
    "seoTitle": "M3 SHCS × 35 mm | WELTOQ",
    "seoDescription": "M3 SHCS × 35 mm · ISO 4762 / DIN 912. A Standard M3×35 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M3",
      "m3 shcs × 35 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 10,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e21",
    "sku": "NUT-M3",
    "name": "M3 NUTS",
    "slug": "m3-nuts",
    "category": "m3-fasteners",
    "shortDescription": "M3 NUTS · ISO 4032 / DIN 934",
    "fullDescription": "A Standard M3 Hex Nut is a metric, six-sided threaded fastener designed to mate with an M3 screw or bolt. It features an internal metric thread and six external flat sides for tightening with a suitable wrench or spanner. It provides a reliable fastening solution for securing components in mechanical assemblies, electronics, robotics, and precision engineering applications.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M3",
    "length": "—",
    "threadType": "Metric coarse",
    "threadPitch": "0.5 mm",
    "standard": "ISO 4032 / DIN 934",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Standard Hex Nut",
    "remark": "—",
    "availableSizes": [
      "M3"
    ],
    "price": 1.8,
    "currency": "INR",
    "moq": 500,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/hex-nut-m3.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Standard Hex Nut"
      },
      {
        "label": "Standard",
        "value": "ISO 4032 / DIN 934"
      },
      {
        "label": "Thread size",
        "value": "M3 (3 mm)"
      },
      {
        "label": "Thread pitch",
        "value": "0.5 mm"
      },
      {
        "label": "Across flats",
        "value": "5.5 mm"
      },
      {
        "label": "Nut thickness",
        "value": "2.4 mm"
      },
      {
        "label": "Nut type",
        "value": "Hex Nut (Full Nut)"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e06",
      "e07",
      "e08"
    ],
    "seoTitle": "M3 NUTS | WELTOQ",
    "seoDescription": "M3 NUTS · ISO 4032 / DIN 934. A Standard M3 Hex Nut is a metric, six-sided threaded fastener designed to mate with an M3 screw or bolt. It features an internal metric thread and six external…",
    "keywords": [
      "M3",
      "m3 nuts",
      "din-934",
      "fastener",
      "Standard Hex Nut",
      "ISO 4032 / DIN 934",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 38,
    "applications": [
      "Securing M3 screws and bolts",
      "General mechanical assemblies",
      "Electronics and small enclosures",
      "Robotics, drones, and automation systems",
      "3D printers and prototype equipment"
    ]
  },
  {
    "id": "e24",
    "sku": "SHCS-M4X10",
    "name": "M4 SHCS × 10 mm",
    "slug": "m4-shcs-10",
    "category": "m4-fasteners",
    "shortDescription": "M4 SHCS × 10 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M4×10 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 4 mm and a length of 10 mm, measured from the underside of the head to the tip. It provides reliable clamping force and secure fastening in mechanical assemblies, machinery, and precision engineering applications.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M4",
    "length": "10 mm",
    "threadType": "Metric coarse",
    "threadPitch": "0.7 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M4 × 10"
    ],
    "price": 5.8,
    "currency": "INR",
    "moq": 200,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m4x10.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M4 (4 mm)"
      },
      {
        "label": "Length",
        "value": "10 mm"
      },
      {
        "label": "Thread pitch",
        "value": "0.7 mm"
      },
      {
        "label": "Head diameter",
        "value": "7.0 mm"
      },
      {
        "label": "Head height",
        "value": "4.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "3.0 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e25",
      "e26",
      "e27"
    ],
    "seoTitle": "M4 SHCS × 10 mm | WELTOQ",
    "seoDescription": "M4 SHCS × 10 mm · ISO 4762 / DIN 912. A Standard M4×10 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M4",
      "m4 shcs × 10 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 11,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e25",
    "sku": "SHCS-M4X12",
    "name": "M4 SHCS × 12 mm",
    "slug": "m4-shcs-12",
    "category": "m4-fasteners",
    "shortDescription": "M4 SHCS × 12 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M4×12 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 4 mm and a length of 12 mm, measured from the underside of the head to the tip. It provides reliable clamping force and secure fastening in mechanical assemblies, machinery, and precision engineering applications.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M4",
    "length": "12 mm",
    "threadType": "Metric coarse",
    "threadPitch": "0.7 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M4 × 12"
    ],
    "price": 6.1,
    "currency": "INR",
    "moq": 200,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m4x12.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M4 (4 mm)"
      },
      {
        "label": "Length",
        "value": "12 mm"
      },
      {
        "label": "Thread pitch",
        "value": "0.7 mm"
      },
      {
        "label": "Head diameter",
        "value": "7.0 mm"
      },
      {
        "label": "Head height",
        "value": "4.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "3.0 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e24",
      "e26",
      "e27"
    ],
    "seoTitle": "M4 SHCS × 12 mm | WELTOQ",
    "seoDescription": "M4 SHCS × 12 mm · ISO 4762 / DIN 912. A Standard M4×12 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M4",
      "m4 shcs × 12 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 12,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e26",
    "sku": "SHCS-M4X16",
    "name": "M4 SHCS × 16 mm",
    "slug": "m4-shcs-16",
    "category": "m4-fasteners",
    "shortDescription": "M4 SHCS × 16 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M4×16 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 4 mm and a length of 16 mm, measured from the underside of the head to the tip. It provides reliable clamping force and secure fastening in mechanical assemblies, machinery, and precision engineering applications.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M4",
    "length": "16 mm",
    "threadType": "Metric coarse",
    "threadPitch": "0.7 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M4 × 16"
    ],
    "price": 6.7,
    "currency": "INR",
    "moq": 200,
    "stockStatus": "low-stock",
    "images": [
      "/products/catalog/shcs-m4x16.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M4 (4 mm)"
      },
      {
        "label": "Length",
        "value": "16 mm"
      },
      {
        "label": "Thread pitch",
        "value": "0.7 mm"
      },
      {
        "label": "Head diameter",
        "value": "7.0 mm"
      },
      {
        "label": "Head height",
        "value": "4.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "3.0 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e24",
      "e25",
      "e27"
    ],
    "seoTitle": "M4 SHCS × 16 mm | WELTOQ",
    "seoDescription": "M4 SHCS × 16 mm · ISO 4762 / DIN 912. A Standard M4×16 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M4",
      "m4 shcs × 16 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": true,
    "catalogPage": 13,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e27",
    "sku": "SHCS-M4X20",
    "name": "M4 SHCS × 20 mm",
    "slug": "m4-shcs-20",
    "category": "m4-fasteners",
    "shortDescription": "M4 SHCS × 20 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M4×20 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 4 mm and a length of 20 mm, measured from the underside of the head to the tip. It provides reliable clamping force and secure fastening in mechanical assemblies, machinery, and precision engineering applications.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M4",
    "length": "20 mm",
    "threadType": "Metric coarse",
    "threadPitch": "0.7 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M4 × 20"
    ],
    "price": 7.3,
    "currency": "INR",
    "moq": 200,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m4x20.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M4 (4 mm)"
      },
      {
        "label": "Length",
        "value": "20 mm"
      },
      {
        "label": "Thread pitch",
        "value": "0.7 mm"
      },
      {
        "label": "Head diameter",
        "value": "7.0 mm"
      },
      {
        "label": "Head height",
        "value": "4.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "3.0 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e24",
      "e25",
      "e26"
    ],
    "seoTitle": "M4 SHCS × 20 mm | WELTOQ",
    "seoDescription": "M4 SHCS × 20 mm · ISO 4762 / DIN 912. A Standard M4×20 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M4",
      "m4 shcs × 20 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 14,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e28",
    "sku": "SHCS-M4X25",
    "name": "M4 SHCS × 25 mm",
    "slug": "m4-shcs-25",
    "category": "m4-fasteners",
    "shortDescription": "M4 SHCS × 25 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M4×25 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 4 mm and a length of 25 mm, measured from the underside of the head to the tip. It provides reliable clamping force and secure fastening in mechanical assemblies where longer thread engagement is required.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M4",
    "length": "25 mm",
    "threadType": "Metric coarse",
    "threadPitch": "0.7 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M4 × 25"
    ],
    "price": 8.1,
    "currency": "INR",
    "moq": 200,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m4x25.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M4 (4 mm)"
      },
      {
        "label": "Length",
        "value": "25 mm"
      },
      {
        "label": "Thread pitch",
        "value": "0.7 mm"
      },
      {
        "label": "Head diameter",
        "value": "7.0 mm"
      },
      {
        "label": "Head height",
        "value": "4.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "3.0 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e24",
      "e25",
      "e26"
    ],
    "seoTitle": "M4 SHCS × 25 mm | WELTOQ",
    "seoDescription": "M4 SHCS × 25 mm · ISO 4762 / DIN 912. A Standard M4×25 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M4",
      "m4 shcs × 25 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 15,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e29",
    "sku": "SHCS-M4X30",
    "name": "M4 SHCS × 30 mm",
    "slug": "m4-shcs-30",
    "category": "m4-fasteners",
    "shortDescription": "M4 SHCS × 30 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M4×30 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 4 mm and a length of 30 mm, measured from the underside of the head to the tip. It is designed to provide secure clamping force and reliable fastening in mechanical assemblies requiring longer thread engagement.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M4",
    "length": "30 mm",
    "threadType": "Metric coarse",
    "threadPitch": "0.7 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M4 × 30"
    ],
    "price": 8.8,
    "currency": "INR",
    "moq": 200,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m4x30.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M4 (4 mm)"
      },
      {
        "label": "Length",
        "value": "30 mm"
      },
      {
        "label": "Thread pitch",
        "value": "0.7 mm"
      },
      {
        "label": "Head diameter",
        "value": "7.0 mm"
      },
      {
        "label": "Head height",
        "value": "4.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "3.0 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e24",
      "e25",
      "e26"
    ],
    "seoTitle": "M4 SHCS × 30 mm | WELTOQ",
    "seoDescription": "M4 SHCS × 30 mm · ISO 4762 / DIN 912. A Standard M4×30 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M4",
      "m4 shcs × 30 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 16,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e30",
    "sku": "SHCS-M4X35",
    "name": "M4 SHCS × 35 mm",
    "slug": "m4-shcs-35",
    "category": "m4-fasteners",
    "shortDescription": "M4 SHCS × 35 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M4×35 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 4 mm and a length of 35 mm, measured from the underside of the head to the tip. It is designed to provide secure clamping force and reliable fastening in mechanical assemblies requiring longer thread engagement.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M4",
    "length": "35 mm",
    "threadType": "Metric coarse",
    "threadPitch": "0.7 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M4 × 35"
    ],
    "price": 9.6,
    "currency": "INR",
    "moq": 200,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m4x35.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M4 (4 mm)"
      },
      {
        "label": "Length",
        "value": "35 mm"
      },
      {
        "label": "Thread pitch",
        "value": "0.7 mm"
      },
      {
        "label": "Head diameter",
        "value": "7.0 mm"
      },
      {
        "label": "Head height",
        "value": "4.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "3.0 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e24",
      "e25",
      "e26"
    ],
    "seoTitle": "M4 SHCS × 35 mm | WELTOQ",
    "seoDescription": "M4 SHCS × 35 mm · ISO 4762 / DIN 912. A Standard M4×35 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M4",
      "m4 shcs × 35 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 17,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e39",
    "sku": "NUT-M4-RH",
    "name": "RH THREAD NUTS M4",
    "slug": "rh-thread-nuts-m4",
    "category": "m4-fasteners",
    "shortDescription": "RH THREAD NUTS M4 · ISO 4032 / DIN 934",
    "fullDescription": "A Standard M4 Hex Nut is a metric, six-sided threaded fastener designed to mate with an M4 screw or bolt. It features an internal metric thread and six external flat sides for tightening with a suitable wrench or spanner. It provides a reliable fastening solution for securing components in mechanical assemblies, machinery, electronics, robotics, and precision engineering applications.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M4",
    "length": "—",
    "threadType": "Metric coarse",
    "threadPitch": "0.7 mm",
    "standard": "ISO 4032 / DIN 934",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Standard Hex Nut",
    "remark": "—",
    "availableSizes": [
      "M4"
    ],
    "price": 2.2,
    "currency": "INR",
    "moq": 500,
    "stockStatus": "low-stock",
    "images": [
      "/products/catalog/hex-nut-m4.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Standard Hex Nut"
      },
      {
        "label": "Standard",
        "value": "ISO 4032 / DIN 934"
      },
      {
        "label": "Thread size",
        "value": "M4 (4 mm)"
      },
      {
        "label": "Thread pitch",
        "value": "0.7 mm"
      },
      {
        "label": "Across flats",
        "value": "7.0 mm"
      },
      {
        "label": "Nut thickness",
        "value": "3.2 mm"
      },
      {
        "label": "Nut type",
        "value": "Hex Nut (Full Nut)"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e24",
      "e25",
      "e26"
    ],
    "seoTitle": "RH THREAD NUTS M4 | WELTOQ",
    "seoDescription": "RH THREAD NUTS M4 · ISO 4032 / DIN 934. A Standard M4 Hex Nut is a metric, six-sided threaded fastener designed to mate with an M4 screw or bolt. It features an internal metric thread and six external…",
    "keywords": [
      "M4",
      "rh thread nuts m4",
      "din-934",
      "fastener",
      "Standard Hex Nut",
      "ISO 4032 / DIN 934",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 39,
    "applications": [
      "Securing M4 screws and bolts",
      "General mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics, automation, and motion systems",
      "3D printers and prototyping equipment"
    ]
  },
  {
    "id": "e46",
    "sku": "SHCS-M6X10",
    "name": "M6 SHCS × 10 mm",
    "slug": "m6-shcs-10",
    "category": "m6-fasteners",
    "shortDescription": "M6 SHCS × 10 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M6×10 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 6 mm and a length of 10 mm, measured from the underside of the head to the tip. It provides reliable clamping force and secure fastening in mechanical assemblies, machinery, and industrial applications.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M6",
    "length": "10 mm",
    "threadType": "Metric coarse",
    "threadPitch": "1.0 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M6 × 10"
    ],
    "price": 11.5,
    "currency": "INR",
    "moq": 200,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m6x10.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M6 (6 mm)"
      },
      {
        "label": "Length",
        "value": "10 mm"
      },
      {
        "label": "Thread pitch",
        "value": "1.0 mm"
      },
      {
        "label": "Head diameter",
        "value": "10.0 mm"
      },
      {
        "label": "Head height",
        "value": "6.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "5.0 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e47",
      "e48",
      "e49"
    ],
    "seoTitle": "M6 SHCS × 10 mm | WELTOQ",
    "seoDescription": "M6 SHCS × 10 mm · ISO 4762 / DIN 912. A Standard M6×10 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M6",
      "m6 shcs × 10 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 18,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e47",
    "sku": "SHCS-M6X12",
    "name": "M6 SHCS × 12 mm",
    "slug": "m6-shcs-12",
    "category": "m6-fasteners",
    "shortDescription": "M6 SHCS × 12 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M6×12 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 6 mm and a length of 12 mm, measured from the underside of the head to the tip. It provides reliable clamping force and secure fastening in mechanical assemblies, machinery, and industrial applications.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M6",
    "length": "12 mm",
    "threadType": "Metric coarse",
    "threadPitch": "1.0 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M6 × 12"
    ],
    "price": 11.8,
    "currency": "INR",
    "moq": 200,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m6x12.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M6 (6 mm)"
      },
      {
        "label": "Length",
        "value": "12 mm"
      },
      {
        "label": "Thread pitch",
        "value": "1.0 mm"
      },
      {
        "label": "Head diameter",
        "value": "10.0 mm"
      },
      {
        "label": "Head height",
        "value": "6.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "5.0 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e46",
      "e48",
      "e49"
    ],
    "seoTitle": "M6 SHCS × 12 mm | WELTOQ",
    "seoDescription": "M6 SHCS × 12 mm · ISO 4762 / DIN 912. A Standard M6×12 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M6",
      "m6 shcs × 12 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 19,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e48",
    "sku": "SHCS-M6X16",
    "name": "M6 SHCS × 16 mm",
    "slug": "m6-shcs-16",
    "category": "m6-fasteners",
    "shortDescription": "M6 SHCS × 16 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M6×16 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 6 mm and a length of 16 mm, measured from the underside of the head to the tip. It provides reliable clamping force and secure fastening in mechanical assemblies, machinery, and industrial applications.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M6",
    "length": "16 mm",
    "threadType": "Metric coarse",
    "threadPitch": "1.0 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M6 × 16"
    ],
    "price": 12.4,
    "currency": "INR",
    "moq": 200,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m6x16.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M6 (6 mm)"
      },
      {
        "label": "Length",
        "value": "16 mm"
      },
      {
        "label": "Thread pitch",
        "value": "1.0 mm"
      },
      {
        "label": "Head diameter",
        "value": "10.0 mm"
      },
      {
        "label": "Head height",
        "value": "6.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "5.0 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e46",
      "e47",
      "e49"
    ],
    "seoTitle": "M6 SHCS × 16 mm | WELTOQ",
    "seoDescription": "M6 SHCS × 16 mm · ISO 4762 / DIN 912. A Standard M6×16 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M6",
      "m6 shcs × 16 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": true,
    "catalogPage": 20,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e49",
    "sku": "SHCS-M6X20",
    "name": "M6 SHCS × 20 mm",
    "slug": "m6-shcs-20",
    "category": "m6-fasteners",
    "shortDescription": "M6 SHCS × 20 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M6×20 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 6 mm and a length of 20 mm, measured from the underside of the head to the tip. It provides reliable clamping force and secure fastening in mechanical assemblies, machinery, and industrial applications.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M6",
    "length": "20 mm",
    "threadType": "Metric coarse",
    "threadPitch": "1.0 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M6 × 20"
    ],
    "price": 13,
    "currency": "INR",
    "moq": 200,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m6x20.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M6 (6 mm)"
      },
      {
        "label": "Length",
        "value": "20 mm"
      },
      {
        "label": "Thread pitch",
        "value": "1.0 mm"
      },
      {
        "label": "Head diameter",
        "value": "10.0 mm"
      },
      {
        "label": "Head height",
        "value": "6.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "5.0 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e46",
      "e47",
      "e48"
    ],
    "seoTitle": "M6 SHCS × 20 mm | WELTOQ",
    "seoDescription": "M6 SHCS × 20 mm · ISO 4762 / DIN 912. A Standard M6×20 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M6",
      "m6 shcs × 20 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 21,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e50",
    "sku": "SHCS-M6X25",
    "name": "M6 SHCS × 25 mm",
    "slug": "m6-shcs-25",
    "category": "m6-fasteners",
    "shortDescription": "M6 SHCS × 25 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M6×25 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 6 mm and a length of 25 mm, measured from the underside of the head to the tip. It provides reliable clamping force and secure fastening in mechanical assemblies, machinery, and industrial applications.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M6",
    "length": "25 mm",
    "threadType": "Metric coarse",
    "threadPitch": "1.0 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M6 × 25"
    ],
    "price": 13.8,
    "currency": "INR",
    "moq": 200,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m6x25.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M6 (6 mm)"
      },
      {
        "label": "Length",
        "value": "25 mm"
      },
      {
        "label": "Thread pitch",
        "value": "1.0 mm"
      },
      {
        "label": "Head diameter",
        "value": "10.0 mm"
      },
      {
        "label": "Head height",
        "value": "6.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "5.0 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e46",
      "e47",
      "e48"
    ],
    "seoTitle": "M6 SHCS × 25 mm | WELTOQ",
    "seoDescription": "M6 SHCS × 25 mm · ISO 4762 / DIN 912. A Standard M6×25 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M6",
      "m6 shcs × 25 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 22,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e51",
    "sku": "SHCS-M6X30",
    "name": "M6 SHCS × 30 mm",
    "slug": "m6-shcs-30",
    "category": "m6-fasteners",
    "shortDescription": "M6 SHCS × 30 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M6×30 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 6 mm and a length of 30 mm, measured from the underside of the head to the tip. It is designed to provide secure clamping force and reliable fastening in mechanical assemblies requiring longer thread engagement.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M6",
    "length": "30 mm",
    "threadType": "Metric coarse",
    "threadPitch": "1.0 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M6 × 30"
    ],
    "price": 14.5,
    "currency": "INR",
    "moq": 200,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m6x30.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M6 (6 mm)"
      },
      {
        "label": "Length",
        "value": "30 mm"
      },
      {
        "label": "Thread pitch",
        "value": "1.0 mm"
      },
      {
        "label": "Head diameter",
        "value": "10.0 mm"
      },
      {
        "label": "Head height",
        "value": "6.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "5.0 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e46",
      "e47",
      "e48"
    ],
    "seoTitle": "M6 SHCS × 30 mm | WELTOQ",
    "seoDescription": "M6 SHCS × 30 mm · ISO 4762 / DIN 912. A Standard M6×30 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M6",
      "m6 shcs × 30 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 23,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e52",
    "sku": "SHCS-M6X35",
    "name": "M6 SHCS × 35 mm",
    "slug": "m6-shcs-35",
    "category": "m6-fasteners",
    "shortDescription": "M6 SHCS × 35 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M6×35 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 6 mm and a length of 35 mm, measured from the underside of the head to the tip. It provides reliable clamping force and secure fastening in mechanical assemblies requiring longer thread engagement.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M6",
    "length": "35 mm",
    "threadType": "Metric coarse",
    "threadPitch": "1.0 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M6 × 35"
    ],
    "price": 15.2,
    "currency": "INR",
    "moq": 200,
    "stockStatus": "low-stock",
    "images": [
      "/products/catalog/shcs-m6x35.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M6 (6 mm)"
      },
      {
        "label": "Length",
        "value": "35 mm"
      },
      {
        "label": "Thread pitch",
        "value": "1.0 mm"
      },
      {
        "label": "Head diameter",
        "value": "10.0 mm"
      },
      {
        "label": "Head height",
        "value": "6.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "5.0 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e46",
      "e47",
      "e48"
    ],
    "seoTitle": "M6 SHCS × 35 mm | WELTOQ",
    "seoDescription": "M6 SHCS × 35 mm · ISO 4762 / DIN 912. A Standard M6×35 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M6",
      "m6 shcs × 35 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 24,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e53",
    "sku": "NUT-M6-RH",
    "name": "RH THREAD NUTS M6",
    "slug": "rh-thread-nuts-m6",
    "category": "m6-fasteners",
    "shortDescription": "RH THREAD NUTS M6 · ISO 4032 / DIN 934",
    "fullDescription": "A Standard M6 Hex Nut is a metric, six-sided threaded fastener designed to mate with an M6 screw or bolt. It features an internal metric thread and six external flat sides for tightening with a suitable wrench or spanner. It provides a reliable fastening solution for securing components in mechanical assemblies, machinery, structural equipment, robotics, and industrial applications.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M6",
    "length": "—",
    "threadType": "Metric coarse",
    "threadPitch": "1.0 mm",
    "standard": "ISO 4032 / DIN 934",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Standard Hex Nut",
    "remark": "—",
    "availableSizes": [
      "M6"
    ],
    "price": 3.5,
    "currency": "INR",
    "moq": 500,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/hex-nut-m6.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Standard Hex Nut"
      },
      {
        "label": "Standard",
        "value": "ISO 4032 / DIN 934"
      },
      {
        "label": "Thread size",
        "value": "M6 (6 mm)"
      },
      {
        "label": "Thread pitch",
        "value": "1.0 mm"
      },
      {
        "label": "Across flats",
        "value": "10.0 mm"
      },
      {
        "label": "Nut thickness",
        "value": "5.0 mm"
      },
      {
        "label": "Nut type",
        "value": "Hex Nut (Full Nut)"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e46",
      "e47",
      "e48"
    ],
    "seoTitle": "RH THREAD NUTS M6 | WELTOQ",
    "seoDescription": "RH THREAD NUTS M6 · ISO 4032 / DIN 934. A Standard M6 Hex Nut is a metric, six-sided threaded fastener designed to mate with an M6 screw or bolt. It features an internal metric thread and six external…",
    "keywords": [
      "M6",
      "rh thread nuts m6",
      "din-934",
      "fastener",
      "Standard Hex Nut",
      "ISO 4032 / DIN 934",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 40,
    "applications": [
      "Securing M6 screws and bolts",
      "General mechanical and structural assemblies",
      "Machinery and equipment enclosures",
      "Robotics, automation, and motion systems",
      "Industrial and prototype equipment"
    ]
  },
  {
    "id": "e65",
    "sku": "SHCS-M8X10",
    "name": "M8 SHCS × 10 mm",
    "slug": "m8-shcs-10",
    "category": "m8-fasteners",
    "shortDescription": "M8 SHCS × 10 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M8×10 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 8 mm and a length of 10 mm, measured from the underside of the head to the tip. It provides reliable clamping force and secure fastening in mechanical assemblies, machinery, and industrial applications.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M8",
    "length": "10 mm",
    "threadType": "Metric coarse",
    "threadPitch": "1.25 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M8 × 10"
    ],
    "price": 18.5,
    "currency": "INR",
    "moq": 100,
    "stockStatus": "low-stock",
    "images": [
      "/products/catalog/shcs-m8x10.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M8 (8 mm)"
      },
      {
        "label": "Length",
        "value": "10 mm"
      },
      {
        "label": "Thread pitch",
        "value": "1.25 mm"
      },
      {
        "label": "Head diameter",
        "value": "13.0 mm"
      },
      {
        "label": "Head height",
        "value": "8.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "6.0 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e66",
      "e67",
      "e68"
    ],
    "seoTitle": "M8 SHCS × 10 mm | WELTOQ",
    "seoDescription": "M8 SHCS × 10 mm · ISO 4762 / DIN 912. A Standard M8×10 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M8",
      "m8 shcs × 10 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 26,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e66",
    "sku": "SHCS-M8X12",
    "name": "M8 SHCS × 12 mm",
    "slug": "m8-shcs-12",
    "category": "m8-fasteners",
    "shortDescription": "M8 SHCS × 12 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M8×12 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 8 mm and a length of 12 mm, measured from the underside of the head to the tip. It provides reliable clamping force and secure fastening in mechanical assemblies, machinery, and industrial applications.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M8",
    "length": "12 mm",
    "threadType": "Metric coarse",
    "threadPitch": "1.25 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M8 × 12"
    ],
    "price": 18.8,
    "currency": "INR",
    "moq": 100,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m8x12.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M8 (8 mm)"
      },
      {
        "label": "Length",
        "value": "12 mm"
      },
      {
        "label": "Thread pitch",
        "value": "1.25 mm"
      },
      {
        "label": "Head diameter",
        "value": "13.0 mm"
      },
      {
        "label": "Head height",
        "value": "8.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "6.0 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e65",
      "e67",
      "e68"
    ],
    "seoTitle": "M8 SHCS × 12 mm | WELTOQ",
    "seoDescription": "M8 SHCS × 12 mm · ISO 4762 / DIN 912. A Standard M8×12 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M8",
      "m8 shcs × 12 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 25,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e67",
    "sku": "SHCS-M8X16",
    "name": "M8 SHCS × 16 mm",
    "slug": "m8-shcs-16",
    "category": "m8-fasteners",
    "shortDescription": "M8 SHCS × 16 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M8×16 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 8 mm and a length of 16 mm, measured from the underside of the head to the tip. It provides reliable clamping force and secure fastening in mechanical assemblies, machinery, and industrial applications.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M8",
    "length": "16 mm",
    "threadType": "Metric coarse",
    "threadPitch": "1.25 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M8 × 16"
    ],
    "price": 19.4,
    "currency": "INR",
    "moq": 100,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m8x16.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M8 (8 mm)"
      },
      {
        "label": "Length",
        "value": "16 mm"
      },
      {
        "label": "Thread pitch",
        "value": "1.25 mm"
      },
      {
        "label": "Head diameter",
        "value": "13.0 mm"
      },
      {
        "label": "Head height",
        "value": "8.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "6.0 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e65",
      "e66",
      "e68"
    ],
    "seoTitle": "M8 SHCS × 16 mm | WELTOQ",
    "seoDescription": "M8 SHCS × 16 mm · ISO 4762 / DIN 912. A Standard M8×16 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M8",
      "m8 shcs × 16 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": true,
    "catalogPage": 27,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e68",
    "sku": "SHCS-M8X20",
    "name": "M8 SHCS × 20 mm",
    "slug": "m8-shcs-20",
    "category": "m8-fasteners",
    "shortDescription": "M8 SHCS × 20 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M8×20 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 8 mm and a length of 20 mm, measured from the underside of the head to the tip. It provides reliable clamping force and secure fastening in mechanical assemblies, machinery, and industrial applications.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M8",
    "length": "20 mm",
    "threadType": "Metric coarse",
    "threadPitch": "1.25 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M8 × 20"
    ],
    "price": 20,
    "currency": "INR",
    "moq": 100,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m8x20.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M8 (8 mm)"
      },
      {
        "label": "Length",
        "value": "20 mm"
      },
      {
        "label": "Thread pitch",
        "value": "1.25 mm"
      },
      {
        "label": "Head diameter",
        "value": "13.0 mm"
      },
      {
        "label": "Head height",
        "value": "8.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "6.0 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e65",
      "e66",
      "e67"
    ],
    "seoTitle": "M8 SHCS × 20 mm | WELTOQ",
    "seoDescription": "M8 SHCS × 20 mm · ISO 4762 / DIN 912. A Standard M8×20 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M8",
      "m8 shcs × 20 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 28,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e69",
    "sku": "SHCS-M8X25",
    "name": "M8 SHCS × 25 mm",
    "slug": "m8-shcs-25",
    "category": "m8-fasteners",
    "shortDescription": "M8 SHCS × 25 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M8×25 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 8 mm and a length of 25 mm, measured from the underside of the head to the tip. It provides reliable clamping force and secure fastening in mechanical assemblies, machinery, and industrial applications.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M8",
    "length": "25 mm",
    "threadType": "Metric coarse",
    "threadPitch": "1.25 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M8 × 25"
    ],
    "price": 20.8,
    "currency": "INR",
    "moq": 100,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m8x25.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M8 (8 mm)"
      },
      {
        "label": "Length",
        "value": "25 mm"
      },
      {
        "label": "Thread pitch",
        "value": "1.25 mm"
      },
      {
        "label": "Head diameter",
        "value": "13.0 mm"
      },
      {
        "label": "Head height",
        "value": "8.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "6.0 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e65",
      "e66",
      "e67"
    ],
    "seoTitle": "M8 SHCS × 25 mm | WELTOQ",
    "seoDescription": "M8 SHCS × 25 mm · ISO 4762 / DIN 912. A Standard M8×25 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M8",
      "m8 shcs × 25 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 29,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e70",
    "sku": "SHCS-M8X30",
    "name": "M8 SHCS × 30 mm",
    "slug": "m8-shcs-30",
    "category": "m8-fasteners",
    "shortDescription": "M8 SHCS × 30 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M8×30 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 8 mm and a length of 30 mm, measured from the underside of the head to the tip. It provides reliable clamping force and secure fastening in mechanical assemblies requiring longer thread engagement.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M8",
    "length": "30 mm",
    "threadType": "Metric coarse",
    "threadPitch": "1.25 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M8 × 30"
    ],
    "price": 21.5,
    "currency": "INR",
    "moq": 100,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m8x30.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M8 (8 mm)"
      },
      {
        "label": "Length",
        "value": "30 mm"
      },
      {
        "label": "Thread pitch",
        "value": "1.25 mm"
      },
      {
        "label": "Head diameter",
        "value": "13.0 mm"
      },
      {
        "label": "Head height",
        "value": "8.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "6.0 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e65",
      "e66",
      "e67"
    ],
    "seoTitle": "M8 SHCS × 30 mm | WELTOQ",
    "seoDescription": "M8 SHCS × 30 mm · ISO 4762 / DIN 912. A Standard M8×30 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M8",
      "m8 shcs × 30 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 30,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e71",
    "sku": "SHCS-M8X35",
    "name": "M8 SHCS × 35 mm",
    "slug": "m8-shcs-35",
    "category": "m8-fasteners",
    "shortDescription": "M8 SHCS × 35 mm · ISO 4762 / DIN 912",
    "fullDescription": "A Standard M8×35 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 8 mm and a length of 35 mm, measured from the underside of the head to the tip. It provides reliable clamping force and secure fastening in mechanical assemblies requiring longer thread engagement.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M8",
    "length": "35 mm",
    "threadType": "Metric coarse",
    "threadPitch": "1.25 mm",
    "standard": "ISO 4762 / DIN 912",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Socket Head Cap Screw",
    "remark": "—",
    "availableSizes": [
      "M8 × 35"
    ],
    "price": 22.2,
    "currency": "INR",
    "moq": 100,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/shcs-m8x35.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Socket Head Cap Screw"
      },
      {
        "label": "Standard",
        "value": "ISO 4762 / DIN 912"
      },
      {
        "label": "Thread diameter",
        "value": "M8 (8 mm)"
      },
      {
        "label": "Length",
        "value": "35 mm"
      },
      {
        "label": "Thread pitch",
        "value": "1.25 mm"
      },
      {
        "label": "Head diameter",
        "value": "13.0 mm"
      },
      {
        "label": "Head height",
        "value": "8.0 mm"
      },
      {
        "label": "Allen key size",
        "value": "6.0 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e65",
      "e66",
      "e67"
    ],
    "seoTitle": "M8 SHCS × 35 mm | WELTOQ",
    "seoDescription": "M8 SHCS × 35 mm · ISO 4762 / DIN 912. A Standard M8×35 SHCS (Socket Head Cap Screw) is a metric threaded fastener featuring a cylindrical head with an internal hexagonal (Allen) drive. It has a nomi…",
    "keywords": [
      "M8",
      "m8 shcs × 35 mm",
      "din-912",
      "fastener",
      "Socket Head Cap Screw",
      "ISO 4762 / DIN 912",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 31,
    "applications": [
      "Precision mechanical assemblies",
      "Electronics and electrical enclosures",
      "Robotics and automation equipment",
      "3D printers and prototyping machines",
      "Industrial machinery and fixtures"
    ]
  },
  {
    "id": "e72",
    "sku": "NUT-M8-RH",
    "name": "RH THREAD NUTS M8",
    "slug": "rh-thread-nuts-m8",
    "category": "m8-fasteners",
    "shortDescription": "RH THREAD NUTS M8 · ISO 4032 / DIN 934",
    "fullDescription": "A Standard M8 Hex Nut is a metric, six-sided threaded fastener designed to mate with an M8 screw or bolt. It features an internal metric thread and six external flat sides for tightening with a suitable wrench or spanner. It provides a reliable fastening solution for securing components in mechanical assemblies, machinery, structural equipment, robotics, automotive, and industrial applications.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M8",
    "length": "—",
    "threadType": "Metric coarse",
    "threadPitch": "1.25 mm",
    "standard": "ISO 4032 / DIN 934",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Standard Hex Nut",
    "remark": "—",
    "availableSizes": [
      "M8"
    ],
    "price": 5,
    "currency": "INR",
    "moq": 500,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/hex-nut-m8.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Standard Hex Nut"
      },
      {
        "label": "Standard",
        "value": "ISO 4032 / DIN 934"
      },
      {
        "label": "Thread size",
        "value": "M8 (8 mm)"
      },
      {
        "label": "Thread pitch",
        "value": "1.25 mm"
      },
      {
        "label": "Across flats",
        "value": "13.0 mm"
      },
      {
        "label": "Nut thickness",
        "value": "6.5 mm"
      },
      {
        "label": "Nut type",
        "value": "Hex Nut (Full Nut)"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e65",
      "e66",
      "e67"
    ],
    "seoTitle": "RH THREAD NUTS M8 | WELTOQ",
    "seoDescription": "RH THREAD NUTS M8 · ISO 4032 / DIN 934. A Standard M8 Hex Nut is a metric, six-sided threaded fastener designed to mate with an M8 screw or bolt. It features an internal metric thread and six external…",
    "keywords": [
      "M8",
      "rh thread nuts m8",
      "din-934",
      "fastener",
      "Standard Hex Nut",
      "ISO 4032 / DIN 934",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 41,
    "applications": [
      "Securing M8 screws and bolts",
      "General mechanical and structural assemblies",
      "Machinery and equipment enclosures",
      "Robotics, automation, and motion systems",
      "Industrial, automotive, and prototype equipment"
    ]
  },
  {
    "id": "e79",
    "sku": "ULTRA-M4-10",
    "name": "ULTRA LOW HEAD (HEX) M4 × 10 mm",
    "slug": "ultra-low-head-hex-m4-10",
    "category": "ultralow-sockets",
    "shortDescription": "ULTRA LOW HEAD (HEX) M4 × 10 mm · Ultraflat Head Socket Screw",
    "fullDescription": "A Standard M4×10 Ultraflat Head Fastener is a metric threaded screw featuring an extra-low-profile head and an internal hexagonal (Allen) drive. It has a nominal thread diameter of 4 mm and a length of 10 mm, measured from the underside of the head to the tip. Its low-profile design makes it suitable for compact mechanical assemblies where limited installation height and minimal head projection are important.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M4",
    "length": "10 mm",
    "threadType": "Metric coarse",
    "threadPitch": "0.7 mm",
    "standard": "—",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Ultraflat Head Socket Screw",
    "remark": "—",
    "availableSizes": [
      "M4 × 10"
    ],
    "price": 22.8,
    "currency": "INR",
    "moq": 200,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/ultraflat-m4x10.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Ultraflat Head Socket Screw"
      },
      {
        "label": "Thread diameter",
        "value": "M4 (4 mm)"
      },
      {
        "label": "Length",
        "value": "10 mm"
      },
      {
        "label": "Thread pitch",
        "value": "0.7 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Allen key size",
        "value": "2.5 mm"
      },
      {
        "label": "Head diameter",
        "value": "Depends on head design"
      },
      {
        "label": "Head height",
        "value": "Depends on head design"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e80",
      "e81",
      "e82"
    ],
    "seoTitle": "ULTRA LOW HEAD (HEX) M4 × 10 mm | WELTOQ",
    "seoDescription": "ULTRA LOW HEAD (HEX) M4 × 10 mm · Ultraflat Head Socket Screw. A Standard M4×10 Ultraflat Head Fastener is a metric threaded screw featuring an extra-low-profile head and an internal hexagonal (Allen) drive. It has a nomina…",
    "keywords": [
      "M4",
      "ultra low head (hex) m4 × 10 mm",
      "fastener",
      "Ultraflat Head Socket Screw",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": true,
    "catalogPage": 32,
    "applications": [
      "Low-profile mechanical assemblies",
      "Precision mechanical equipment",
      "Electronics and compact enclosures",
      "Robotics and automation systems",
      "3D printers and lightweight structures"
    ]
  },
  {
    "id": "e80",
    "sku": "ULTRA-M4-12",
    "name": "ULTRA LOW HEAD (HEX) M4 × 12 mm",
    "slug": "ultra-low-head-hex-m4-12",
    "category": "ultralow-sockets",
    "shortDescription": "ULTRA LOW HEAD (HEX) M4 × 12 mm · Ultraflat Head Socket Screw",
    "fullDescription": "A Standard M4×12 Ultraflat Head Fastener is a metric threaded screw featuring an extra-low-profile, wide cylindrical head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 4 mm and a length of 12 mm, measured from the underside of the head to the tip. Its low-profile design makes it suitable for compact mechanical assemblies where reduced head projection and limited installation space are important.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M4",
    "length": "12 mm",
    "threadType": "Metric coarse",
    "threadPitch": "0.7 mm",
    "standard": "—",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Ultraflat Head Socket Screw",
    "remark": "—",
    "availableSizes": [
      "M4 × 12"
    ],
    "price": 24,
    "currency": "INR",
    "moq": 200,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/ultraflat-m4x12.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Ultraflat Head Socket Screw"
      },
      {
        "label": "Thread diameter",
        "value": "M4 (4 mm)"
      },
      {
        "label": "Length",
        "value": "12 mm"
      },
      {
        "label": "Thread pitch",
        "value": "0.7 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Allen key size",
        "value": "2.5 mm"
      },
      {
        "label": "Head diameter",
        "value": "8.0 mm*"
      },
      {
        "label": "Head height",
        "value": "1.2 mm*"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e79",
      "e81",
      "e82"
    ],
    "seoTitle": "ULTRA LOW HEAD (HEX) M4 × 12 mm | WELTOQ",
    "seoDescription": "ULTRA LOW HEAD (HEX) M4 × 12 mm · Ultraflat Head Socket Screw. A Standard M4×12 Ultraflat Head Fastener is a metric threaded screw featuring an extra-low-profile, wide cylindrical head with an internal hexagonal (Allen) dri…",
    "keywords": [
      "M4",
      "ultra low head (hex) m4 × 12 mm",
      "fastener",
      "Ultraflat Head Socket Screw",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 33,
    "applications": [
      "Low-profile mechanical assemblies",
      "Precision mechanical equipment",
      "Electronics and compact enclosures",
      "Robotics and automation systems",
      "3D printers and lightweight structures"
    ]
  },
  {
    "id": "e81",
    "sku": "ULTRA-M4-16",
    "name": "ULTRA LOW HEAD (HEX) M4 × 16 mm",
    "slug": "ultra-low-head-hex-m4-16",
    "category": "ultralow-sockets",
    "shortDescription": "ULTRA LOW HEAD (HEX) M4 × 16 mm · Ultraflat Head Socket Screw",
    "fullDescription": "A Standard M4×16 Ultraflat Head Fastener is a metric threaded screw featuring an extra-low-profile, wide head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 4 mm and a length of 16 mm, measured from the underside of the head to the tip. Its low-profile design makes it suitable for compact mechanical assemblies where reduced head projection and limited installation space are important.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M4",
    "length": "16 mm",
    "threadType": "Metric coarse",
    "threadPitch": "0.7 mm",
    "standard": "—",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Ultraflat Head Socket Screw",
    "remark": "—",
    "availableSizes": [
      "M4 × 16"
    ],
    "price": 26.4,
    "currency": "INR",
    "moq": 200,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/ultraflat-m4x16.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Ultraflat Head Socket Screw"
      },
      {
        "label": "Thread diameter",
        "value": "M4 (4 mm)"
      },
      {
        "label": "Length",
        "value": "16 mm"
      },
      {
        "label": "Thread pitch",
        "value": "0.7 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Allen key size",
        "value": "2.5 mm"
      },
      {
        "label": "Head diameter",
        "value": "8.0 mm*"
      },
      {
        "label": "Head height",
        "value": "1.2 mm*"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e79",
      "e80",
      "e82"
    ],
    "seoTitle": "ULTRA LOW HEAD (HEX) M4 × 16 mm | WELTOQ",
    "seoDescription": "ULTRA LOW HEAD (HEX) M4 × 16 mm · Ultraflat Head Socket Screw. A Standard M4×16 Ultraflat Head Fastener is a metric threaded screw featuring an extra-low-profile, wide head with an internal hexagonal (Allen) drive. It has a…",
    "keywords": [
      "M4",
      "ultra low head (hex) m4 × 16 mm",
      "fastener",
      "Ultraflat Head Socket Screw",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 34,
    "applications": [
      "Low-profile mechanical assemblies",
      "Precision mechanical equipment",
      "Electronics and compact enclosures",
      "Robotics and automation systems",
      "3D printers and lightweight structures"
    ]
  },
  {
    "id": "e82",
    "sku": "ULTRA-M4-20",
    "name": "ULTRA LOW HEAD (HEX) M4 × 20 mm",
    "slug": "ultra-low-head-hex-m4-20",
    "category": "ultralow-sockets",
    "shortDescription": "ULTRA LOW HEAD (HEX) M4 × 20 mm · Ultraflat Head Socket Screw",
    "fullDescription": "A Standard M4×20 Ultraflat Head Fastener is a metric threaded screw featuring an extra-low-profile, wide head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 4 mm and a length of 20 mm, measured from the underside of the head to the tip. Its low-profile design makes it suitable for compact mechanical assemblies where reduced head projection and limited installation space are important.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M4",
    "length": "20 mm",
    "threadType": "Metric coarse",
    "threadPitch": "0.7 mm",
    "standard": "—",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Ultraflat Head Socket Screw",
    "remark": "—",
    "availableSizes": [
      "M4 × 20"
    ],
    "price": 28.8,
    "currency": "INR",
    "moq": 200,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/ultraflat-m4x20.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Ultraflat Head Socket Screw"
      },
      {
        "label": "Thread diameter",
        "value": "M4 (4 mm)"
      },
      {
        "label": "Length",
        "value": "20 mm"
      },
      {
        "label": "Thread pitch",
        "value": "0.7 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Allen key size",
        "value": "2.5 mm"
      },
      {
        "label": "Head diameter",
        "value": "8.0 mm*"
      },
      {
        "label": "Head height",
        "value": "1.2 mm*"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e79",
      "e80",
      "e81"
    ],
    "seoTitle": "ULTRA LOW HEAD (HEX) M4 × 20 mm | WELTOQ",
    "seoDescription": "ULTRA LOW HEAD (HEX) M4 × 20 mm · Ultraflat Head Socket Screw. A Standard M4×20 Ultraflat Head Fastener is a metric threaded screw featuring an extra-low-profile, wide head with an internal hexagonal (Allen) drive. It has a…",
    "keywords": [
      "M4",
      "ultra low head (hex) m4 × 20 mm",
      "fastener",
      "Ultraflat Head Socket Screw",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 35,
    "applications": [
      "Low-profile mechanical assemblies",
      "Precision mechanical equipment",
      "Electronics and compact enclosures",
      "Robotics and automation systems",
      "3D printers and lightweight structures"
    ]
  },
  {
    "id": "e83",
    "sku": "ULTRA-M4-25",
    "name": "ULTRA LOW HEAD (HEX) M4 × 25 mm",
    "slug": "ultra-low-head-hex-m4-25",
    "category": "ultralow-sockets",
    "shortDescription": "ULTRA LOW HEAD (HEX) M4 × 25 mm · Ultraflat Head Socket Screw",
    "fullDescription": "A Standard M4×25 Ultraflat Head Fastener is a metric threaded screw featuring an extra-low-profile, wide head with an internal hexagonal (Allen) drive. It has a nominal thread diameter of 4 mm and a length of 25 mm, measured from the underside of the head to the tip. Its low-profile design makes it suitable for compact mechanical assemblies where reduced head projection and limited installation space are important.",
    "material": "To be confirmed",
    "grade": "—",
    "finish": "To be confirmed",
    "diameter": "M4",
    "length": "25 mm",
    "threadType": "Metric coarse",
    "threadPitch": "0.7 mm",
    "standard": "—",
    "strength": "—",
    "propertyClass": "—",
    "fastenerType": "Ultraflat Head Socket Screw",
    "remark": "—",
    "availableSizes": [
      "M4 × 25"
    ],
    "price": 31.8,
    "currency": "INR",
    "moq": 200,
    "stockStatus": "in-stock",
    "images": [
      "/products/catalog/ultraflat-m4x25.jpg"
    ],
    "modelPath": null,
    "specs": [
      {
        "label": "Fastener type",
        "value": "Ultraflat Head Socket Screw"
      },
      {
        "label": "Thread diameter",
        "value": "M4 (4 mm)"
      },
      {
        "label": "Length",
        "value": "25 mm"
      },
      {
        "label": "Thread pitch",
        "value": "0.7 mm"
      },
      {
        "label": "Drive type",
        "value": "Internal Hex"
      },
      {
        "label": "Allen key size",
        "value": "2.5 mm"
      },
      {
        "label": "Head diameter",
        "value": "8.0 mm*"
      },
      {
        "label": "Head height",
        "value": "1.2 mm*"
      },
      {
        "label": "Material",
        "value": "To be confirmed"
      },
      {
        "label": "Surface finish",
        "value": "To be confirmed"
      }
    ],
    "related": [
      "e79",
      "e80",
      "e81"
    ],
    "seoTitle": "ULTRA LOW HEAD (HEX) M4 × 25 mm | WELTOQ",
    "seoDescription": "ULTRA LOW HEAD (HEX) M4 × 25 mm · Ultraflat Head Socket Screw. A Standard M4×25 Ultraflat Head Fastener is a metric threaded screw featuring an extra-low-profile, wide head with an internal hexagonal (Allen) drive. It has a…",
    "keywords": [
      "M4",
      "ultra low head (hex) m4 × 25 mm",
      "fastener",
      "Ultraflat Head Socket Screw",
      "WELTOQ catalogue"
    ],
    "sample": false,
    "featured": false,
    "catalogPage": 36,
    "applications": [
      "Low-profile mechanical assemblies",
      "Precision mechanical equipment",
      "Electronics and compact enclosures",
      "Robotics and automation systems",
      "3D printers and lightweight structures"
    ]
  }
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const productById = (id: string) => products.find((p) => p.id === id);

export const filterOptions = {
  materials: [...new Set(products.map((p) => p.material))],
  grades: [...new Set(products.map((p) => p.grade))],
  diameters: [...new Set(products.map((p) => p.diameter))],
  finishes: [...new Set(products.map((p) => p.finish))],
  threads: [...new Set(products.map((p) => p.threadType))],
  availability: ['in-stock', 'low-stock', 'made-to-order', 'quote-only'] as const,
};
