import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Locale } from '@/lib/i18n'

async function getMessages(locale: Locale) {
  try {
    return (await import(`../../../messages/${locale}.json`)).default
  } catch (error) {
    return (await import(`../../../messages/en.json`)).default
  }
}

export default async function DisclaimerPage({ params: { locale } }: { params: { locale: Locale } }) {
  const messages = await getMessages(locale)

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          {messages.disclaimer.title}
        </h1>
        <p className="text-xl text-muted-foreground">
          {messages.disclaimer.subtitle}
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{messages.disclaimer.anonymousPlatform.title}</CardTitle>
            <CardDescription>
              {messages.disclaimer.anonymousPlatform.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              {messages.disclaimer.anonymousPlatform.content}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{messages.disclaimer.contentResponsibility.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>
                {messages.disclaimer.contentResponsibility.userResponsibility.split(':')[0]}:
              </strong>{' '}
              {messages.disclaimer.contentResponsibility.userResponsibility.split(':').slice(1).join(':')}
            </p>
            <p>
              <strong>
                {messages.disclaimer.contentResponsibility.noModeration.split(':')[0]}:
              </strong>{' '}
              {messages.disclaimer.contentResponsibility.noModeration.split(':').slice(1).join(':')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{messages.disclaimer.prohibitedContent.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{messages.disclaimer.prohibitedContent.intro}</p>
            <ul className="space-y-2 list-disc list-inside text-sm">
              {messages.disclaimer.prohibitedContent.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{messages.disclaimer.privacy.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>
                {messages.disclaimer.privacy.noPersonalData.split(':')[0]}:
              </strong>{' '}
              {messages.disclaimer.privacy.noPersonalData.split(':').slice(1).join(':')}
            </p>
            <p>
              <strong>
                {messages.disclaimer.privacy.technicalData.split(':')[0]}:
              </strong>{' '}
              {messages.disclaimer.privacy.technicalData.split(':').slice(1).join(':')}
            </p>
            <p>
              <strong>
                {messages.disclaimer.privacy.contentStorage.split(':')[0]}:
              </strong>{' '}
              {messages.disclaimer.privacy.contentStorage.split(':').slice(1).join(':')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{messages.disclaimer.liability.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>
                {messages.disclaimer.liability.noWarranties.split(':')[0]}:
              </strong>{' '}
              {messages.disclaimer.liability.noWarranties.split(':').slice(1).join(':')}
            </p>
            <p>
              <strong>
                {messages.disclaimer.liability.userContent.split(':')[0]}:
              </strong>{' '}
              {messages.disclaimer.liability.userContent.split(':').slice(1).join(':')}
            </p>
            <p>
              <strong>
                {messages.disclaimer.liability.serviceAvailability.split(':')[0]}:
              </strong>{' '}
              {messages.disclaimer.liability.serviceAvailability.split(':').slice(1).join(':')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{messages.disclaimer.contentRemoval.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>
                {messages.disclaimer.contentRemoval.reporting.split(':')[0]}:
              </strong>{' '}
              {messages.disclaimer.contentRemoval.reporting.split(':').slice(1).join(':')}
            </p>
            <p>
              <strong>
                {messages.disclaimer.contentRemoval.removalProcess.split(':')[0]}:
              </strong>{' '}
              {messages.disclaimer.contentRemoval.removalProcess.split(':').slice(1).join(':')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{messages.disclaimer.legalCompliance.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>
                {messages.disclaimer.legalCompliance.jurisdiction.split(':')[0]}:
              </strong>{' '}
              {messages.disclaimer.legalCompliance.jurisdiction.split(':').slice(1).join(':')}
            </p>
            <p>
              <strong>
                {messages.disclaimer.legalCompliance.lawEnforcement.split(':')[0]}:
              </strong>{' '}
              {messages.disclaimer.legalCompliance.lawEnforcement.split(':').slice(1).join(':')}
            </p>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              {messages.disclaimer.footer}
            </p>
            <p className="text-sm text-muted-foreground text-center mt-4">
              {messages.disclaimer.lastUpdated}: {new Date().toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}