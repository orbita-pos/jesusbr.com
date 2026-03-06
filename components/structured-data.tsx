export function StructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Jesus Bernal",
    url: "https://jesusbr.com",
    jobTitle: "Fundador",
    worksFor: {
      "@type": "Organization",
      name: "Orbita POS",
      url: "https://orbitapos.com",
    },
    sameAs: [
      "https://github.com/orbita-pos",
      "https://www.linkedin.com/in/jesus-bernal-2b1a1b228",
      "https://x.com/OrbitaPOS",
    ],
    knowsAbout: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Electron",
      "React Native",
      "Point of Sale systems",
      "Computer Vision",
      "SaaS",
    ],
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Orbita POS",
    url: "https://orbitapos.com",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Windows, macOS, iOS, Android",
    description:
      "Sistema de punto de venta con vision AI, modo offline y facturacion electronica para tienditas y PyMEs en Mexico.",
    author: {
      "@type": "Person",
      name: "Jesus Bernal",
      url: "https://jesusbr.com",
    },
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "MXN",
        name: "Free",
      },
      {
        "@type": "Offer",
        price: "149",
        priceCurrency: "MXN",
        name: "Start",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "149",
          priceCurrency: "MXN",
          billingDuration: "P1M",
        },
      },
      {
        "@type": "Offer",
        price: "299",
        priceCurrency: "MXN",
        name: "Pro",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "299",
          priceCurrency: "MXN",
          billingDuration: "P1M",
        },
      },
      {
        "@type": "Offer",
        price: "499",
        priceCurrency: "MXN",
        name: "Multi",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "499",
          priceCurrency: "MXN",
          billingDuration: "P1M",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
    </>
  );
}
