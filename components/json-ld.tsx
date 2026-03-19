import Script from 'next/script'

interface SchemaProps {
  schema: Record<string, any>
}

export function JsonLd({ schema }: SchemaProps) {
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
