import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, HelpCircle } from 'lucide-react';

const About = () => {
    const faqs = [
        {
            q: "Who are the instructors?",
            a: "Our instructors are industry veterans from top tech companies like Google, Amazon, and Microsoft, passionate about teaching."
        },
        {
            q: "Will I get a certificate?",
            a: "Yes! Upon completing a course and passing the final assessment, you will receive a verified certificate that you can share on LinkedIn."
        },
        {
            q: "How does the placement support work?",
            a: "We have partnerships with over 500+ companies. Once you complete our 'Job Ready' tracks, our placement team helps schedule interviews for you."
        }
    ];

    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 bg-slate-50">
            <div className="max-w-4xl mx-auto text-center mb-20">
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">About Averqon Learn</h1>
                <p className="text-xl text-slate-500 leading-relaxed">
                    We are on a mission to democratize elite tech education. We believe that top-tier coding skills shouldn't cost a fortune.
                </p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                {[
                    { label: 'Students Trained', value: '50k+' },
                    { label: 'Hiring Partners', value: '500+' },
                    { label: 'Instructors', value: '100+' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-200 p-8 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                        <div className="text-slate-500 font-medium">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full text-left p-6 flex justify-between items-center text-slate-900 font-semibold hover:bg-slate-50 transition-colors"
                            >
                                <span className="flex items-center gap-3">
                                    <HelpCircle size={20} className="text-primary" />
                                    {faq.q}
                                </span>
                                {openFaq === i ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
                            </button>
                            {openFaq === i && (
                                <div className="p-6 pt-0 text-slate-500 border-t border-slate-50 bg-slate-50/50">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
