"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useLocale } from "@/hooks/use-locale"

export default function PrivacyPage() {
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
              {locale === "zh" ? "隐私政策" : "Privacy Policy"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {locale === "zh" ? "最后更新：2025年1月" : "Last Updated: January 2025"}
            </p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            {locale === "zh" ? (
              <>
                <h2>1. 引言</h2>
                <p>
                  智学语言（"我们"、"我们的"）重视您的隐私。本隐私政策说明我们如何收集、使用、披露和保护您的个人信息。
                </p>

                <h2>2. 我们收集的信息</h2>
                <h3>2.1 您提供的信息</h3>
                <ul>
                  <li>账户信息：电子邮件地址、用户名、密码</li>
                  <li>个人资料：姓名、头像、学习偏好</li>
                  <li>学习数据：学习进度、测试结果、练习记录</li>
                  <li>支付信息：通过第三方支付处理器处理</li>
                </ul>

                <h3>2.2 自动收集的信息</h3>
                <ul>
                  <li>设备信息：IP 地址、浏览器类型、操作系统</li>
                  <li>使用数据：访问时间、页面浏览、功能使用</li>
                  <li>Cookie 和类似技术</li>
                </ul>

                <h2>3. 我们如何使用您的信息</h2>
                <p>我们使用收集的信息用于：</p>
                <ul>
                  <li>提供和改进我们的服务</li>
                  <li>个性化您的学习体验</li>
                  <li>处理交易和发送通知</li>
                  <li>分析使用模式和趋势</li>
                  <li>防止欺诈和确保安全</li>
                  <li>遵守法律义务</li>
                </ul>

                <h2>4. Cookie 和跟踪技术</h2>
                <p>我们使用以下类型的 Cookie：</p>
                <ul>
                  <li>
                    <strong>必要 Cookie：</strong>网站正常运行所必需
                  </li>
                  <li>
                    <strong>分析 Cookie：</strong>帮助我们了解用户如何使用网站
                  </li>
                  <li>
                    <strong>营销 Cookie：</strong>用于提供个性化广告
                  </li>
                </ul>
                <p>您可以通过我们的 Cookie 同意横幅管理您的 Cookie 偏好。</p>

                <h2>5. 信息共享</h2>
                <p>我们可能在以下情况下共享您的信息：</p>
                <ul>
                  <li>
                    <strong>服务提供商：</strong>帮助我们运营服务的第三方（如支付处理器、云存储）
                  </li>
                  <li>
                    <strong>法律要求：</strong>遵守法律、法规或法律程序
                  </li>
                  <li>
                    <strong>业务转让：</strong>在合并、收购或资产出售的情况下
                  </li>
                  <li>
                    <strong>经您同意：</strong>在其他情况下经您明确同意
                  </li>
                </ul>

                <h2>6. 数据安全</h2>
                <p>
                  我们实施适当的技术和组织措施来保护您的个人信息，包括：
                </p>
                <ul>
                  <li>加密传输和存储</li>
                  <li>访问控制和身份验证</li>
                  <li>定期安全审计</li>
                  <li>员工培训和保密协议</li>
                </ul>

                <h2>7. 数据保留</h2>
                <p>
                  我们保留您的个人信息的时间取决于收集目的和法律要求。当不再需要时，我们将安全删除或匿名化您的信息。
                </p>

                <h2>8. 您的权利</h2>
                <p>根据适用法律，您可能有以下权利：</p>
                <ul>
                  <li>访问您的个人信息</li>
                  <li>更正不准确的信息</li>
                  <li>删除您的信息</li>
                  <li>限制或反对处理</li>
                  <li>数据可携带性</li>
                  <li>撤回同意</li>
                </ul>

                <h2>9. 儿童隐私</h2>
                <p>
                  我们的服务不针对 13 岁以下的儿童。我们不会故意收集 13 岁以下儿童的个人信息。
                </p>

                <h2>10. 国际数据传输</h2>
                <p>
                  您的信息可能会被传输到您所在国家/地区以外的服务器。我们确保采取适当的保护措施。
                </p>

                <h2>11. 第三方链接</h2>
                <p>
                  我们的服务可能包含第三方网站的链接。我们不对这些网站的隐私做法负责。
                </p>

                <h2>12. 政策变更</h2>
                <p>
                  我们可能会不时更新本隐私政策。重大变更将通过电子邮件或服务通知您。
                </p>

                <h2>13. 联系我们</h2>
                <p>如果您对本隐私政策有任何疑问或疑虑，请联系我们：</p>
                <ul>
                  <li>电子邮件：privacy@smartlanguagelearning.com</li>
                  <li>地址：中国上海市</li>
                </ul>

                <h2>14. GDPR 合规（欧盟用户）</h2>
                <p>如果您位于欧盟，您享有 GDPR 规定的额外权利，包括：</p>
                <ul>
                  <li>数据可携带权</li>
                  <li>被遗忘权</li>
                  <li>向监管机构投诉的权利</li>
                </ul>
              </>
            ) : (
              <>
                <h2>1. Introduction</h2>
                <p>
                  Smart Language Learning ("we", "our") values your privacy. This Privacy Policy explains how we
                  collect, use, disclose, and protect your personal information.
                </p>

                <h2>2. Information We Collect</h2>
                <h3>2.1 Information You Provide</h3>
                <ul>
                  <li>Account information: email address, username, password</li>
                  <li>Profile information: name, avatar, learning preferences</li>
                  <li>Learning data: progress, test results, practice records</li>
                  <li>Payment information: processed through third-party payment processors</li>
                </ul>

                <h3>2.2 Automatically Collected Information</h3>
                <ul>
                  <li>Device information: IP address, browser type, operating system</li>
                  <li>Usage data: access times, page views, feature usage</li>
                  <li>Cookies and similar technologies</li>
                </ul>

                <h2>3. How We Use Your Information</h2>
                <p>We use the collected information to:</p>
                <ul>
                  <li>Provide and improve our services</li>
                  <li>Personalize your learning experience</li>
                  <li>Process transactions and send notifications</li>
                  <li>Analyze usage patterns and trends</li>
                  <li>Prevent fraud and ensure security</li>
                  <li>Comply with legal obligations</li>
                </ul>

                <h2>4. Cookies and Tracking Technologies</h2>
                <p>We use the following types of cookies:</p>
                <ul>
                  <li>
                    <strong>Necessary Cookies:</strong> Essential for website functionality
                  </li>
                  <li>
                    <strong>Analytics Cookies:</strong> Help us understand how users interact with the website
                  </li>
                  <li>
                    <strong>Marketing Cookies:</strong> Used to deliver personalized advertising
                  </li>
                </ul>
                <p>You can manage your cookie preferences through our cookie consent banner.</p>

                <h2>5. Information Sharing</h2>
                <p>We may share your information in the following circumstances:</p>
                <ul>
                  <li>
                    <strong>Service Providers:</strong> Third parties that help us operate services (e.g., payment
                    processors, cloud storage)
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> To comply with laws, regulations, or legal processes
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In the event of a merger, acquisition, or asset sale
                  </li>
                  <li>
                    <strong>With Your Consent:</strong> In other cases with your explicit consent
                  </li>
                </ul>

                <h2>6. Data Security</h2>
                <p>We implement appropriate technical and organizational measures to protect your personal information, including:</p>
                <ul>
                  <li>Encrypted transmission and storage</li>
                  <li>Access controls and authentication</li>
                  <li>Regular security audits</li>
                  <li>Employee training and confidentiality agreements</li>
                </ul>

                <h2>7. Data Retention</h2>
                <p>
                  We retain your personal information for as long as necessary for the purposes of collection and legal
                  requirements. When no longer needed, we will securely delete or anonymize your information.
                </p>

                <h2>8. Your Rights</h2>
                <p>Depending on applicable law, you may have the following rights:</p>
                <ul>
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your information</li>
                  <li>Restrict or object to processing</li>
                  <li>Data portability</li>
                  <li>Withdraw consent</li>
                </ul>

                <h2>9. Children's Privacy</h2>
                <p>
                  Our services are not directed to children under 13. We do not knowingly collect personal information
                  from children under 13.
                </p>

                <h2>10. International Data Transfers</h2>
                <p>
                  Your information may be transferred to servers outside your country/region. We ensure appropriate
                  safeguards are in place.
                </p>

                <h2>11. Third-Party Links</h2>
                <p>
                  Our services may contain links to third-party websites. We are not responsible for the privacy
                  practices of these websites.
                </p>

                <h2>12. Policy Changes</h2>
                <p>
                  We may update this Privacy Policy from time to time. Significant changes will be notified via email
                  or service notification.
                </p>

                <h2>13. Contact Us</h2>
                <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
                <ul>
                  <li>Email: privacy@smartlanguagelearning.com</li>
                  <li>Address: Shanghai, China</li>
                </ul>

                <h2>14. GDPR Compliance (EU Users)</h2>
                <p>If you are located in the EU, you have additional rights under GDPR, including:</p>
                <ul>
                  <li>Right to data portability</li>
                  <li>Right to be forgotten</li>
                  <li>Right to lodge a complaint with a supervisory authority</li>
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
