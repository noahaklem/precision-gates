'use client'
import { useState } from 'react'

export default function Testimonials() {
  const data = [
    {
      name: 'David E., Lakewood',
      quote: `Precision Gates and Automation have been nothing but incredible when servicing our Colorado-based clients. 
      I have witnessed time and time again as PGA has arrived at a customer’s place of business when expected, promptly diagnosed a problem, 
      and performed the needed repairs in the least amount of time possible.

      PGA is SO MUCH MORE than a simple maintenance company which might blindly attempt a repair and upon failing miserably, 
      suggest replacing your entire system at your expense!

      The staff at PGA continue to prove their knowledge and technical expertise in access control and security to my clients.  
      I can promise you, you will save time & money, not to mention your reputation, if you use a no-nonsense company such as this one, 
      and get the work done correctly.

      The PGA staff is also thorough and insightful when providing consultation, material, and installation on any new project one might be planning. 
      With years of industry experience the staff at PGA has the knowhow to get your security in place and operational, the first time.

      I repeatedly hear great things from local customers that have trusted PGA with their businesses.

      — David Essman, Director of Marketing, Sentinel Systems Corp.`
    },
    { name:'Samantha K., Highlands Ranch', quote:'Exactly what we wanted for our custom steel gate.' },
    { name:'Ops Manager, Aurora', quote:'Slide gate + access control working perfectly. Great crew.' },
  ];

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (name: string) => {
    setExpanded(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <section className="container">
      <h2 className="text-3xl font-semibold">What Clients Say</h2>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {data.map((t) => {
          const isLong = t.quote.length > 250;
          const showAll = expanded[t.name];
          const quote = showAll ? t.quote : t.quote.slice(0, 250) + (isLong ? '…' : '');
          return (
            <figure
              key={t.name}
              className="rounded-2xl border border-white/10 bg-black/30 p-6 flex flex-col justify-between"
            >
              <blockquote className="text-gray-100 whitespace-pre-line">{`“${quote}”`}</blockquote>
              {isLong && (
                <button
                  type="button"
                  onClick={() => toggle(t.name)}
                  className="mt-3 text-sm text-brand-accent hover:text-white transition"
                >
                  {showAll ? 'Show less' : 'Show more'}
                </button>
              )}
              <figcaption className="mt-4 text-sm text-gray-300">— {t.name}</figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}

