import { client } from "@/sanity/lib/client"
import { contactPageQuery } from "@/sanity/lib/queries"
import type { ContactPage } from "@/sanity/types"
import { ContactSlideshow } from "@/components/contact-slideshow"
import { PortableText } from "@portabletext/react"
import { ContactHeader } from "@/components/contact-header"

export const metadata = {
  title: "Contact Us | Archive Fine Textiles",
  description: "Get in touch with Archive Fine Textiles",
}

export default async function ContactUsPage() {
  const contactData = await client.fetch<ContactPage>(contactPageQuery)

  return (
    <>
      <ContactHeader />
      <main className="min-h-screen pt-[80px]">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left column - Slideshow */}
            <div>{contactData?.images && <ContactSlideshow images={contactData.images} />}</div>

            {/* Right column - Rich text content */}
            <div className="flex items-center justify-center">
              <div className="prose prose-sm max-w-none text-center">
                {contactData?.content ? (
                  <PortableText
                    value={contactData.content}
                    components={{
                      block: {
                        normal: ({ children }) => (
                          <p className="text-base leading-relaxed mb-6 font-sans">{children}</p>
                        ),
                        h1: ({ children }) => <h1 className="text-3xl font-heading mb-6">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-heading mb-4">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-heading mb-3">{children}</h3>,
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-2 border-accent pl-4 italic my-6">{children}</blockquote>
                        ),
                      },
                      list: {
                        bullet: ({ children }) => <ul className="list-disc list-inside mb-6 space-y-2">{children}</ul>,
                        number: ({ children }) => (
                          <ol className="list-decimal list-inside mb-6 space-y-2">{children}</ol>
                        ),
                      },
                      listItem: {
                        bullet: ({ children }) => <li className="text-base font-sans">{children}</li>,
                        number: ({ children }) => <li className="text-base font-sans">{children}</li>,
                      },
                      marks: {
                        link: ({ children, value }) => (
                          <a
                            href={value?.href}
                            className="text-accent hover:underline underline-offset-2"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {children}
                          </a>
                        ),
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                      },
                    }}
                  />
                ) : (
                  <p className="text-muted-foreground">Contact information coming soon.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
