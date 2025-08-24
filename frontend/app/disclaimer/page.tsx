import { redirect } from 'next/navigation'

export default function DisclaimerRootPage() {
  redirect('/en/disclaimer')
}
  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Disclaimer & Terms
        </h1>
        <p className="text-xl text-muted-foreground">
          Important information about using this platform
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Anonymous Content Platform</CardTitle>
            <CardDescription>
              This platform allows users to share content anonymously without registration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This website is designed as an anonymous content sharing platform where users can 
              publish articles, stories, poems, and thoughts without creating accounts or providing 
              personal information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Responsibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>User Responsibility:</strong> All content published on this platform is the 
              sole responsibility of the person who submitted it. Users are responsible for ensuring 
              their content complies with applicable laws and regulations.
            </p>
            <p>
              <strong>No Content Moderation:</strong> Due to the anonymous nature of this platform, 
              we do not pre-moderate content. However, we reserve the right to remove content that 
              violates our terms or applicable laws.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prohibited Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">The following types of content are strictly prohibited:</p>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li>Illegal content or content that promotes illegal activities</li>
              <li>Hate speech, harassment, or content targeting individuals or groups</li>
              <li>Content that infringes on intellectual property rights</li>
              <li>Spam, malicious links, or attempts to distribute malware</li>
              <li>Personal information of others (doxxing)</li>
              <li>Content that violates privacy rights</li>
              <li>Explicit sexual content involving minors</li>
              <li>Content that promotes violence or self-harm</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy & Data Collection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>No Personal Data:</strong> We do not collect personal information, email 
              addresses, or require user registration. The platform is designed to be truly anonymous.
            </p>
            <p>
              <strong>Technical Data:</strong> We may collect basic technical information such as 
              IP addresses for security purposes and to prevent abuse, but this data is not linked 
              to user identities.
            </p>
            <p>
              <strong>Content Storage:</strong> All submitted content is stored on our servers. 
              While we don't track authorship, the content itself becomes part of our database.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>No Warranties:</strong> This platform is provided "as is" without any 
              warranties, express or implied. We do not guarantee the accuracy, completeness, 
              or reliability of any content.
            </p>
            <p>
              <strong>User Content:</strong> We are not responsible for user-generated content 
              and do not endorse any opinions, recommendations, or advice expressed by users.
            </p>
            <p>
              <strong>Service Availability:</strong> We do not guarantee continuous availability 
              of the service and reserve the right to modify or discontinue the platform at any time.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Removal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>Reporting:</strong> If you encounter content that violates these terms, 
              please report it through appropriate channels. Due to the anonymous nature of the 
              platform, we cannot provide direct contact methods within the platform itself.
            </p>
            <p>
              <strong>Removal Process:</strong> We reserve the right to remove any content that 
              violates these terms or applicable laws without prior notice.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Legal Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>Jurisdiction:</strong> This platform operates under applicable laws and 
              regulations. Users are responsible for ensuring their content complies with laws 
              in their jurisdiction.
            </p>
            <p>
              <strong>Law Enforcement:</strong> We will cooperate with law enforcement agencies 
              when required by law, though our ability to provide user information is limited 
              due to our anonymous design.
            </p>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              By using this platform, you acknowledge that you have read, understood, and agree 
              to be bound by these terms. These terms may be updated from time to time, and 
              continued use of the platform constitutes acceptance of any changes.
            </p>
            <p className="text-sm text-muted-foreground text-center mt-4">
              Last updated: {new Date().toLocaleDateString('en-US', { 
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