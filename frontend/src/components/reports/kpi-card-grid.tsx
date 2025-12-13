'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, BarChart3, FileText, CheckCircle, TrendingUp, Activity } from 'lucide-react';

interface KpiData {
    new_leads_assigned: number;
    meetings_completed: number;
    demos_completed: number;
    activities_logged: number;
    tasks_completed: number;
    deals_won: number;
    conversion_rate: number;
}

interface KpiCardGridProps {
    kpiData: KpiData;
    onCardClick: (title: string, dataType: string) => void;
}

export function KpiCardGrid({ kpiData, onCardClick }: KpiCardGridProps) {
    const kpiCards = [
        {
            title: 'New Leads',
            value: kpiData.new_leads_assigned,
            icon: Users,
            color: 'text-primary/50',
            dataType: 'leads'
        },
        {
            title: 'Meetings',
            value: kpiData.meetings_completed,
            icon: Target,
            color: 'text-blue-500/50',
            dataType: 'meetings'
        },
        {
            title: 'Demos',
            value: kpiData.demos_completed,
            icon: BarChart3,
            color: 'text-purple-500/50',
            dataType: 'demos'
        },
        {
            title: 'Activities',
            value: kpiData.activities_logged,
            icon: Activity,
            color: 'text-cyan-500/50',
            dataType: 'activities'
        },
        {
            title: 'Tasks',
            value: kpiData.tasks_completed,
            icon: CheckCircle,
            color: 'text-emerald-500/50',
            dataType: 'tasks'
        },
        {
            title: 'Deals Won',
            value: kpiData.deals_won,
            icon: FileText,
            color: 'text-green-500/50',
            dataType: 'deals'
        },
        {
            title: 'Conversion',
            value: `${kpiData.conversion_rate}%`,
            icon: TrendingUp,
            color: 'text-primary/50',
            dataType: 'conversion',
            highlight: true
        }
    ];

    return (
        <div className="grid grid-cols-4 gap-2">
            {kpiCards.map((card) => {
                const Icon = card.icon;
                return (
                    <Card
                        key={card.title}
                        className={`hover:shadow-md transition-all cursor-pointer ${card.highlight ? 'bg-primary/5 border-primary/20' : ''
                            }`}
                        onClick={() => onCardClick(card.title, card.dataType)}
                    >
                        <CardContent className="p-2">
                            <div className="flex flex-col items-center text-center">
                                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${card.color}`} />
                                <p className="text-[10px] sm:text-xs text-muted-foreground">{card.title}</p>
                                <p className="text-base sm:text-lg font-bold">{card.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
