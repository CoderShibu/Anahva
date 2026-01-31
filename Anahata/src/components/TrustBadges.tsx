import { Shield, Lock, EyeOff, Ban } from 'lucide-react';

const TrustBadges = () => {
  const badges = [
    { icon: Lock, text: 'Encrypted on Device', color: 'text-primary' },
    { icon: EyeOff, text: 'No Data Selling', color: 'text-primary' },
    { icon: Ban, text: 'No Ads', color: 'text-primary' },
    { icon: Shield, text: 'Anonymous by Default', color: 'text-primary' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border">
      {badges.map((badge, index) => (
        <div key={index} className="flex items-center gap-2">
          <badge.icon className={`w-4 h-4 ${badge.color}`} />
          <span className="text-xs text-muted-foreground">{badge.text}</span>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;

