import React from 'react';
import { 
  Laptop, Code, Atom, BarChart3, Briefcase, BookOpen, Scale, 
  HeartPulse, Pill, Sprout, Compass, Palette, Utensils, Radio, 
  Sparkles, Activity, Wrench, Brain, Shield, Database, Cpu, 
  Zap, Cog, Rocket, Plane, Car, Dna, Factory, Hammer, Settings, 
  Bot, Leaf, Flame, Mountain, Boxes, Ship, Printer, Beaker, 
  Gem, ShieldAlert, HardHat, GraduationCap, Layers 
} from 'lucide-react';

const iconCatalog = {
  Laptop, Code, Atom, BarChart3, Briefcase, BookOpen, Scale, 
  HeartPulse, Pill, Sprout, Compass, Palette, Utensils, Radio, 
  Sparkles, Activity, Wrench, Brain, Shield, Database, Cpu, 
  Zap, Cog, Rocket, Plane, Car, Dna, Factory, Hammer, Settings, 
  Bot, Leaf, Flame, Mountain, Boxes, Ship, Printer, Beaker, 
  Gem, ShieldAlert, HardHat, GraduationCap, Layers
};

export default function DynamicIcon({ name, className = 'w-6 h-6', defaultIcon: Default = GraduationCap }) {
  const IconComponent = (name && iconCatalog[name]) ? iconCatalog[name] : Default;
  return <IconComponent className={className} />;
}
