import Image from 'next/image';
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';

interface EventCardProps {
  title: string;
  chapter: string;
  description: string;
  date: string;
  time: string;
  photoUrl: string;
  formLink: string;
  status: 'upcoming' | 'past';
}

export default function EventCard({
  title,
  chapter,
  description,
  date,
  time,
  photoUrl,
  formLink,
  status
}: EventCardProps) {
  return (
    <div className="flex flex-col bg-surface-dark border border-deep-navy/30 rounded-xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1 hover:border-primary-navy">
      <div className="relative h-48 w-full bg-deep-navy/20">
        {photoUrl ? (
          <Image 
            src={photoUrl} 
            alt={title} 
            fill 
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-text-muted">
            No Image
          </div>
        )}
        <div className="absolute top-4 left-4 bg-primary-navy text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {chapter}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        
        <div className="flex items-center gap-4 text-sm text-sky-blue mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{time}</span>
          </div>
        </div>
        
        <p className="text-text-muted text-sm mb-6 flex-grow line-clamp-3">
          {description}
        </p>
        
        {status === 'upcoming' ? (
          <a
            href={formLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full bg-primary-navy hover:bg-deep-navy text-white font-medium py-2.5 rounded-md transition-colors"
          >
            Register Now
            <ArrowUpRight className="w-4 h-4" />
          </a>
        ) : (
          <button
            disabled
            className="inline-flex items-center justify-center w-full bg-bg-dark text-text-muted border border-deep-navy/30 font-medium py-2.5 rounded-md cursor-not-allowed"
          >
            Registration Closed
          </button>
        )}
      </div>
    </div>
  );
}
