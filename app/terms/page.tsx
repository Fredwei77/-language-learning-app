"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useLocale } from "@/hooks/use-locale"

export default function TermsPage() {
  const { locale } = useLocale()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {locale === "zh" ? "返回首页" : "Back to Home"}
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              {locale === "zh" ? "服务条款" : "Terms of Service"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {locale === "zh" ? "最后更新：2025年1月" : "Last Updated: January 2025"}
            </p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            {locale === "zh" ? (
              <>
                <h2>1. 接受条款</h2>
                <p>
                  欢迎使用智学语言学习平台。通过访问或使用我们的服务，您同意受这些服务条款的约束。如果您不同意这些条款，请不要使用我们的服务。
                </p>

                <h2>2. 服务描述</h2>
                <p>智学语言提供以下服务：</p>
                <ul>
                  <li>AI 驱动的语言学习工具</li>
                  <li>智能词典查询</li>
                  <li>发音评测和练习</li>
                  <li>在线课程和教材</li>
                  <li>学习进度跟踪</li>
                </ul>

                <h2>3. 用户账户</h2>
                <p>
                  您需要创建账户才能使用某些功能。您有责任：
                </p>
                <ul>
                  <li>保护您的账户信息安全</li>
                  <li>对您账户下的所有活动负责</li>
                  <li>立即通知我们任何未经授权的使用</li>
                </ul>

                <h2>4. 用户行为</h2>
                <p>使用我们的服务时，您同意不会：</p>
                <ul>
                  <li>违反任何法律或法规</li>
                  <li>侵犯他人的权利</li>
                  <li>上传恶意软件或有害内容</li>
                  <li>干扰或破坏服务的正常运行</li>
                  <li>未经授权访问系统或数据</li>
                </ul>

                <h2>5. 知识产权</h2>
                <p>
                  我们的服务及其所有内容、功能和特性均为智学语言或其许可方所有，受版权、商标和其他知识产权法律保护。
                </p>

                <h2>6. 付费服务</h2>
                <p>
                  某些功能可能需要付费。所有费用均以人民币计价。付款通过安全的第三方支付处理器处理。
                </p>

                <h2>7. 金币系统</h2>
                <p>
                  我们的金币系统允许用户通过学习活动赚取虚拟货币。金币可用于兑换平台内的奖励，但不能兑换现金。
                </p>

                <h2>8. 终止</h2>
                <p>
                  我们保留随时暂停或终止您访问服务的权利，恕不另行通知，原因包括但不限于违反这些条款。
                </p>

                <h2>9. 免责声明</h2>
                <p>
                  服务按"原样"和"可用"基础提供。我们不保证服务将不间断、安全或无错误。
                </p>

                <h2>10. 责任限制</h2>
                <p>
                  在法律允许的最大范围内，智学语言不对任何间接、偶然、特殊、后果性或惩罚性损害承担责任。
                </p>

                <h2>11. 变更</h2>
                <p>
                  我们保留随时修改这些条款的权利。重大变更将通过电子邮件或服务通知您。继续使用服务即表示接受修改后的条款。
                </p>

                <h2>12. 联系我们</h2>
                <p>
                  如果您对这些条款有任何疑问，请通过以下方式联系我们：
                </p>
                <ul>
                  <li>电子邮件：support@smartlanguagelearning.com</li>
                  <li>地址：中国上海市</li>
                </ul>
              </>
            ) : (
              <>
                <h2>1. Acceptance of Terms</h2>
                <p>
                  Welcome to Smart Language Learning Platform. By accessing or using our services, you agree to be
                  bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>

                <h2>2. Service Description</h2>
                <p>Smart Language Learning provides the following services:</p>
                <ul>
                  <li>AI-powered language learning tools</li>
                  <li>Smart dictionary lookup</li>
                  <li>Pronunciation assessment and practice</li>
                  <li>Online courses and materials</li>
                  <li>Learning progress tracking</li>
                </ul>

                <h2>3. User Accounts</h2>
                <p>You need to create an account to use certain features. You are responsible for:</p>
                <ul>
                  <li>Keeping your account information secure</li>
                  <li>All activities under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                </ul>

                <h2>4. User Conduct</h2>
                <p>When using our services, you agree not to:</p>
                <ul>
                  <li>Violate any laws or regulations</li>
                  <li>Infringe on others' rights</li>
                  <li>Upload malware or harmful content</li>
                  <li>Interfere with or disrupt the normal operation of services</li>
                  <li>Access systems or data without authorization</li>
                </ul>

                <h2>5. Intellectual Property</h2>
                <p>
                  Our services and all content, features, and functionality are owned by Smart Language Learning or its
                  licensors and are protected by copyright, trademark, and other intellectual property laws.
                </p>

                <h2>6. Paid Services</h2>
                <p>
                  Certain features may require payment. All fees are quoted in Chinese Yuan (CNY). Payments are
                  processed through secure third-party payment processors.
                </p>

                <h2>7. Coin System</h2>
                <p>
                  Our coin system allows users to earn virtual currency through learning activities. Coins can be used
                  to redeem rewards within the platform but cannot be exchanged for cash.
                </p>

                <h2>8. Termination</h2>
                <p>
                  We reserve the right to suspend or terminate your access to the services at any time, without notice,
                  for reasons including but not limited to violation of these terms.
                </p>

                <h2>9. Disclaimer</h2>
                <p>
                  Services are provided on an "as is" and "as available" basis. We do not guarantee that services will
                  be uninterrupted, secure, or error-free.
                </p>

                <h2>10. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law, Smart Language Learning shall not be liable for any indirect,
                  incidental, special, consequential, or punitive damages.
                </p>

                <h2>11. Changes</h2>
                <p>
                  We reserve the right to modify these terms at any time. Significant changes will be notified via
                  email or service notification. Continued use of services constitutes acceptance of modified terms.
                </p>

                <h2>12. Contact Us</h2>
                <p>If you have any questions about these terms, please contact us:</p>
                <ul>
                  <li>Email: support@smartlanguagelearning.com</li>
                  <li>Address: Shanghai, China</li>
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
