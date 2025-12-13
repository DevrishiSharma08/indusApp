'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportChartsProps {
    activityData: Array<{ name: string; value: number }>;
    trendData: Array<{ date: string; leads: number; meetings: number }>;
    sourceData: Array<{ name: string; value: number }>;
}

export function ReportCharts({ activityData, trendData }: ReportChartsProps) {
    return (
        <div id="charts-section" className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {/* Activity Breakdown */}
            <Card>
                <CardHeader className="pb-1 px-3 pt-2">
                    <CardTitle className="text-xs sm:text-sm">Activity Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                    <ResponsiveContainer width="100%" height={160}>
                        <BarChart data={activityData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Trend Over Time */}
            <Card>
                <CardHeader className="pb-1 px-3 pt-2">
                    <CardTitle className="text-xs sm:text-sm">Activity Trend</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                    <ResponsiveContainer width="100%" height={160}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                            <Line type="monotone" dataKey="leads" stroke="#8884d8" strokeWidth={2} />
                            <Line type="monotone" dataKey="meetings" stroke="#82ca9d" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
