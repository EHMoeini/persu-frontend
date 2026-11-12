import { ContactCard } from '@/features/landing/components/contact-card';
import { FaqCard } from '@/features/landing/components/faq-card';
import { SportSearchCard } from '@/features/landing/components/sport-search-card';
import { SportShowcase } from '@/features/landing/SportShowcase';

export default function Page() {
    return (
        <div className="flex w-full flex-col gap-5 px-4 pt-4 pb-6">
            <SportShowcase />
            <SportSearchCard />
            <FaqCard />
            <ContactCard />
        </div>
    );
}
