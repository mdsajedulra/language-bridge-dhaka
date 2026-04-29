import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useLocalized } from '@/hooks/useLocalized';

type LegalPageType = 'privacy' | 'terms';

interface LegalPageProps {
  type: LegalPageType;
}

const fallbackContent = {
  privacy: {
    title: {
      en: 'Privacy Policy',
      bn: 'প্রাইভেসি পলিসি',
      zh: '隐私政策',
    },
    content: {
      en: `We collect information that you submit through admission forms, contact forms, newsletter subscriptions, and course inquiries. This may include your name, email address, phone number, address, education level, preferred schedule, and message details.

We use this information to respond to inquiries, process admission requests, provide course updates, manage student communication, improve institute services, and maintain website operations.

Public website content such as courses, teachers, books, notices, gallery items, videos, alumni profiles, services, partners, media updates, testimonials, navigation items, and site settings is managed by authorized administrators.

Media files may be hosted through Cloudinary, and authorized automation tools may access website data through secure API endpoints protected by an API key.

We do not sell personal information. Access to admission applications, contact submissions, and newsletter subscribers is restricted to authorized administrators.

To request correction or removal of your submitted information, contact us using the website contact details.`,
      bn: `আমরা admission form, contact form, newsletter subscription এবং course inquiry-এর মাধ্যমে আপনার দেওয়া তথ্য সংগ্রহ করি। এর মধ্যে আপনার নাম, ইমেইল ঠিকানা, ফোন নম্বর, ঠিকানা, শিক্ষাগত যোগ্যতা, পছন্দের সময়সূচি এবং বার্তার বিবরণ থাকতে পারে।

এই তথ্যগুলো আমরা inquiry-এর উত্তর দেওয়া, admission request process করা, course update পাঠানো, student communication পরিচালনা করা, institute service উন্নত করা এবং website operation বজায় রাখার জন্য ব্যবহার করি।

Courses, teachers, books, notices, gallery items, videos, alumni profiles, services, partners, media updates, testimonials, navigation items এবং site settings-এর মতো public website content authorized admin দ্বারা পরিচালিত হয়।

Media files Cloudinary-এর মাধ্যমে host হতে পারে, এবং authorized automation tools secure API endpoint-এর মাধ্যমে API key ব্যবহার করে website data access করতে পারে।

আমরা personal information বিক্রি করি না। Admission applications, contact submissions এবং newsletter subscribers data শুধু authorized admin access করতে পারে।

আপনার জমা দেওয়া তথ্য সংশোধন বা মুছে ফেলার অনুরোধ করতে website-এর contact details ব্যবহার করে আমাদের সাথে যোগাযোগ করুন।`,
      zh: `我们会收集您通过报名表、联系表、通讯订阅和课程咨询提交的信息，包括姓名、电子邮箱、电话号码、地址、教育程度、偏好时间和留言内容。

这些信息用于回复咨询、处理报名申请、发送课程更新、管理学生沟通、改进学院服务并维护网站运营。

课程、教师、书籍、通知、图库、视频、校友资料、服务、合作伙伴、媒体动态、评价、导航和网站设置等公开内容由授权管理员管理。

媒体文件可能通过 Cloudinary 托管，授权自动化工具可通过受 API Key 保护的安全接口访问网站数据。

我们不会出售个人信息。报名申请、联系提交和通讯订阅数据仅限授权管理员访问。

如需更正或删除您提交的信息，请通过网站联系方式与我们联系。`,
    },
  },
  terms: {
    title: {
      en: 'Terms of Service',
      bn: 'ব্যবহারের শর্তাবলি',
      zh: '服务条款',
    },
    content: {
      en: `By using this website, you agree to use it only for lawful purposes related to learning about Yidai Yilu Chinese Language Institute, courses, admission, notices, jobs, alumni, books, HSK information, campus updates, videos, and contact services.

Information on this website is provided for general guidance. Course details, fees, schedules, admission availability, job notices, book prices, and institute information may change without prior notice.

When you submit forms, you agree to provide accurate information. False, misleading, abusive, or unauthorized submissions may be rejected or removed.

Website content, including text, images, course information, teacher profiles, gallery media, videos, and institute branding, may not be copied or reused without permission.

We may update website content, services, policies, and these terms at any time. Continued use of the website means you accept the updated terms.

For questions about these terms, contact the institute through the official contact information on the website.`,
      bn: `এই website ব্যবহার করার মাধ্যমে আপনি সম্মত হচ্ছেন যে এটি শুধুমাত্র Yidai Yilu Chinese Language Institute, courses, admission, notices, jobs, alumni, books, HSK information, campus updates, videos এবং contact services সম্পর্কে বৈধ উদ্দেশ্যে ব্যবহার করবেন।

এই website-এর information সাধারণ guidance হিসেবে দেওয়া হয়। Course details, fees, schedules, admission availability, job notices, book prices এবং institute information পূর্ব ঘোষণা ছাড়াই পরিবর্তন হতে পারে।

আপনি form submit করলে সঠিক information দেওয়ার বিষয়ে সম্মত থাকবেন। ভুল, বিভ্রান্তিকর, অপব্যবহারমূলক বা unauthorized submission reject বা remove করা হতে পারে।

Website content, text, images, course information, teacher profiles, gallery media, videos এবং institute branding অনুমতি ছাড়া copy বা reuse করা যাবে না।

আমরা যেকোনো সময় website content, services, policies এবং এই terms update করতে পারি। Website ব্যবহার চালিয়ে গেলে updated terms আপনি গ্রহণ করেছেন বলে গণ্য হবে।

এই terms সম্পর্কে কোনো প্রশ্ন থাকলে website-এর official contact information ব্যবহার করে institute-এর সাথে যোগাযোগ করুন।`,
      zh: `使用本网站即表示您同意仅为了解一带一路中文学院、课程、报名、通知、招聘、校友、书籍、HSK 信息、校园动态、视频和联系服务等合法目的使用本网站。

本网站信息仅供一般参考。课程详情、费用、时间安排、报名名额、招聘通知、书籍价格和学院信息可能会在未提前通知的情况下变更。

提交表单时，您同意提供准确的信息。虚假、误导、滥用或未经授权的提交可能会被拒绝或删除。

未经许可，不得复制或重复使用网站内容，包括文字、图片、课程信息、教师资料、图库媒体、视频和学院品牌内容。

我们可随时更新网站内容、服务、政策和本条款。继续使用本网站即表示您接受更新后的条款。

如对本条款有任何疑问，请通过网站官方联系方式与学院联系。`,
    },
  },
};

const LegalPage = ({ type }: LegalPageProps) => {
  const { getLocalizedText } = useLocalized();
  const titleKey = type === 'privacy' ? 'privacy_policy_title' : 'terms_service_title';
  const contentKey = type === 'privacy' ? 'privacy_policy_content' : 'terms_service_content';

  const { data: settings, isLoading } = useQuery({
    queryKey: ['legal-page', type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', [titleKey, contentKey]);

      if (error) throw error;
      return data?.reduce((acc, item) => {
        acc[item.key] = item;
        return acc;
      }, {} as Record<string, typeof data[0]>);
    },
  });

  const fallback = fallbackContent[type];
  const title = settings?.[titleKey]
    ? getLocalizedText(settings[titleKey].value_en, settings[titleKey].value_bn, settings[titleKey].value_zh)
    : getLocalizedText(fallback.title.en, fallback.title.bn, fallback.title.zh);
  const content = settings?.[contentKey]
    ? getLocalizedText(settings[contentKey].value_en, settings[contentKey].value_bn, settings[contentKey].value_zh)
    : getLocalizedText(fallback.content.en, fallback.content.bn, fallback.content.zh);

  return (
    <Layout>
      <section className="bg-secondary py-16 sm:py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl">{title}</h1>
          </motion.div>
        </div>
      </section>

      <section className="bg-background py-14 sm:py-18">
        <div className="container">
          <article className="mx-auto max-w-4xl space-y-6 text-base leading-8 text-muted-foreground sm:text-lg">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-11/12" />
                <Skeleton className="h-5 w-10/12" />
                <Skeleton className="h-5 w-full" />
              </div>
            ) : (
              content.split('\n').filter(Boolean).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            )}
          </article>
        </div>
      </section>
    </Layout>
  );
};

export default LegalPage;