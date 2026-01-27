import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const partners = [
  {
    id: 1,
    name: 'RZ (Canton) Education Technology Company Limited',
    nameBn: 'আরজেড (ক্যান্টন) এডুকেশন টেকনোলজি কোম্পানি লিমিটেড',
    nameZh: 'RZ（广州）教育科技有限公司',
    logo: '🏢',
  },
  {
    id: 2,
    name: 'Hainan College of Economics and Business',
    nameBn: 'হাইনান কলেজ অফ ইকোনমিক্স অ্যান্ড বিজনেস',
    nameZh: '海南经贸职业技术学院',
    logo: '🎓',
  },
  {
    id: 3,
    name: 'Confucius Institute',
    nameBn: 'কনফুসিয়াস ইনস্টিটিউট',
    nameZh: '孔子学院',
    logo: '🏛️',
  },
  {
    id: 4,
    name: 'China Education Association',
    nameBn: 'চায়না এডুকেশন অ্যাসোসিয়েশন',
    nameZh: '中国教育协会',
    logo: '📚',
  },
  {
    id: 5,
    name: 'Bangladesh-China Chamber of Commerce',
    nameBn: 'বাংলাদেশ-চীন চেম্বার অফ কমার্স',
    nameZh: '孟中商会',
    logo: '🤝',
  },
  {
    id: 6,
    name: 'Dhaka University Chinese Department',
    nameBn: 'ঢাকা বিশ্ববিদ্যালয় চীনা বিভাগ',
    nameZh: '达卡大学中文系',
    logo: '🎓',
  },
];

const PartnersSection = () => {
  const { t, i18n } = useTranslation();

  const getLocalizedName = (partner: typeof partners[0]) => {
    switch (i18n.language) {
      case 'bn': return partner.nameBn;
      case 'zh': return partner.nameZh;
      default: return partner.name;
    }
  };

  return (
    <section className="py-20 bg-secondary">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('partners.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('partners.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-background rounded-xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {partner.logo}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {getLocalizedName(partner)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
