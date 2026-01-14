import React from 'react';
import { Star, Clock, BarChart, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const CourseCard = ({ course }) => {
    const { title, instructor, rating, students, duration, level, image, price } = course;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
        >
            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="px-2 py-1 text-xs font-semibold bg-primary text-white rounded-md shadow-lg">
                        {level}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                </div>

                <p className="text-sm text-slate-500 mb-3">{instructor}</p>

                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-slate-700 font-medium">{rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{students} students</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{duration}</span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xl font-bold text-slate-900">
                        {price === 0 ? 'Free' : `$${price}`}
                    </div>
                    <button className="px-4 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary hover:text-white transition-all">
                        Enroll Now
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default CourseCard;
