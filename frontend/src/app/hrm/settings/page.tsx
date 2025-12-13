'use client';

import { useState } from 'react';
import { Settings, Save, Calendar, FileText, Shield, Laptop } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

export default function HRMSettingsPage() {
  const [workFromHome, setWorkFromHome] = useState(true);
  const [hybridMode, setHybridMode] = useState(true);
  const [autoApproval, setAutoApproval] = useState(false);
  const [requireDocuments, setRequireDocuments] = useState(true);

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        <PageHeader
          title="HR Settings"
        />

        <Tabs defaultValue="salary-structure" className="space-y-4">
          <TabsList className="inline-flex h-auto w-full justify-start overflow-x-auto lg:grid lg:grid-cols-5">
            <TabsTrigger value="salary-structure" className="flex-shrink-0">
              <FileText className="w-4 h-4 mr-2 hidden sm:inline" />
              Salary Structure
            </TabsTrigger>
            <TabsTrigger value="leave-settings" className="flex-shrink-0">
              <Calendar className="w-4 h-4 mr-2 hidden sm:inline" />
              Leave Settings
            </TabsTrigger>
            <TabsTrigger value="wfh-settings" className="flex-shrink-0">
              <Laptop className="w-4 h-4 mr-2 hidden sm:inline" />
              WFH Settings
            </TabsTrigger>
            <TabsTrigger value="company-policies" className="flex-shrink-0">
              <Shield className="w-4 h-4 mr-2 hidden sm:inline" />
              Policies
            </TabsTrigger>
            <TabsTrigger value="general" className="flex-shrink-0">
              <Settings className="w-4 h-4 mr-2 hidden sm:inline" />
              General
            </TabsTrigger>
          </TabsList>

          {/* Salary Structure Settings */}
          <TabsContent value="salary-structure" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Salary Components Configuration</CardTitle>
                <CardDescription>Define default salary structure and components</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="basic-percentage">Basic Salary (%)</Label>
                    <Input id="basic-percentage" type="number" defaultValue="50" />
                    <p className="text-xs text-muted-foreground">Percentage of CTC allocated to basic salary</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hra-percentage">HRA (%)</Label>
                    <Input id="hra-percentage" type="number" defaultValue="40" />
                    <p className="text-xs text-muted-foreground">House Rent Allowance percentage of basic</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="special-allowance">Special Allowance (%)</Label>
                    <Input id="special-allowance" type="number" defaultValue="10" />
                    <p className="text-xs text-muted-foreground">Special allowance percentage of CTC</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pf-percentage">Provident Fund (%)</Label>
                    <Input id="pf-percentage" type="number" defaultValue="12" />
                    <p className="text-xs text-muted-foreground">Employee PF contribution</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Statutory Deductions</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="professional-tax">Professional Tax (Monthly)</Label>
                      <Input id="professional-tax" type="number" defaultValue="200" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="esi-percentage">ESI (%)</Label>
                      <Input id="esi-percentage" type="number" defaultValue="3.25" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tds-threshold">TDS Threshold</Label>
                      <Input id="tds-threshold" type="number" defaultValue="250000" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gratuity-years">Gratuity Eligibility (Years)</Label>
                      <Input id="gratuity-years" type="number" defaultValue="5" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Bonus & Increments</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="annual-bonus">Annual Bonus (%)</Label>
                      <Input id="annual-bonus" type="number" defaultValue="10" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="performance-bonus">Performance Bonus Range</Label>
                      <Input id="performance-bonus" placeholder="5-15%" defaultValue="5-15" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="increment-month">Annual Increment Month</Label>
                      <Select defaultValue="april">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="january">January</SelectItem>
                          <SelectItem value="april">April</SelectItem>
                          <SelectItem value="july">July</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avg-increment">Average Increment (%)</Label>
                      <Input id="avg-increment" type="number" defaultValue="8" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Save Salary Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leave Settings */}
          <TabsContent value="leave-settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Leave Policy Configuration</CardTitle>
                <CardDescription>Configure leave types, quotas, and approval rules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="annual-leave">Annual Leave (Days)</Label>
                    <Input id="annual-leave" type="number" defaultValue="21" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sick-leave">Sick Leave (Days)</Label>
                    <Input id="sick-leave" type="number" defaultValue="12" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="casual-leave">Casual Leave (Days)</Label>
                    <Input id="casual-leave" type="number" defaultValue="10" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maternity-leave">Maternity Leave (Days)</Label>
                    <Input id="maternity-leave" type="number" defaultValue="182" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paternity-leave">Paternity Leave (Days)</Label>
                    <Input id="paternity-leave" type="number" defaultValue="15" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comp-off">Comp-Off Validity (Days)</Label>
                    <Input id="comp-off" type="number" defaultValue="90" />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Leave Rules</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Carry Forward Leaves</Label>
                        <p className="text-sm text-muted-foreground">Allow unused leaves to carry forward to next year</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Maximum Carry Forward</Label>
                        <Input type="number" className="w-20" defaultValue="10" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Require Manager Approval</Label>
                        <p className="text-sm text-muted-foreground">All leaves require manager approval</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Minimum Notice Period (Days)</Label>
                        <Input type="number" className="w-20" defaultValue="2" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Allow Half-Day Leaves</Label>
                        <p className="text-sm text-muted-foreground">Enable half-day leave option</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Encashment Allowed</Label>
                        <p className="text-sm text-muted-foreground">Allow leave encashment at year end</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Save Leave Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* WFH Settings */}
          <TabsContent value="wfh-settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Work From Home Configuration</CardTitle>
                <CardDescription>Configure WFH policies and hybrid work settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Work From Home</Label>
                      <p className="text-sm text-muted-foreground">Allow employees to work remotely</p>
                    </div>
                    <Switch checked={workFromHome} onCheckedChange={setWorkFromHome} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Hybrid Work Mode</Label>
                      <p className="text-sm text-muted-foreground">Mix of office and remote work</p>
                    </div>
                    <Switch checked={hybridMode} onCheckedChange={setHybridMode} disabled={!workFromHome} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Approval for WFH</Label>
                      <p className="text-sm text-muted-foreground">Automatically approve WFH requests</p>
                    </div>
                    <Switch checked={autoApproval} onCheckedChange={setAutoApproval} disabled={!workFromHome} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Supporting Documents</Label>
                      <p className="text-sm text-muted-foreground">Require reason/document for WFH</p>
                    </div>
                    <Switch checked={requireDocuments} onCheckedChange={setRequireDocuments} disabled={!workFromHome} />
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="wfh-days">Max WFH Days per Month</Label>
                    <Input id="wfh-days" type="number" defaultValue="10" disabled={!workFromHome} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="office-days">Mandatory Office Days per Week</Label>
                    <Select defaultValue="3" disabled={!hybridMode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 Days</SelectItem>
                        <SelectItem value="3">3 Days</SelectItem>
                        <SelectItem value="4">4 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="advance-days">Advance Notice Required (Days)</Label>
                    <Input id="advance-days" type="number" defaultValue="1" disabled={!workFromHome} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wfh-start-time">WFH Core Hours Start</Label>
                    <Input id="wfh-start-time" type="time" defaultValue="10:00" disabled={!workFromHome} />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Remote Work Guidelines</h3>
                  <Textarea
                    placeholder="Enter guidelines for remote work (e.g., availability expectations, communication protocols, equipment requirements)"
                    rows={4}
                    defaultValue="Employees working from home must be available during core hours (10 AM - 4 PM) and respond to messages within 30 minutes. Daily stand-up attendance is mandatory via video call."
                    disabled={!workFromHome}
                  />
                </div>

                <div className="flex justify-end">
                  <Button disabled={!workFromHome}>
                    <Save className="w-4 h-4 mr-2" />
                    Save WFH Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Policies */}
          <TabsContent value="company-policies" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="work-hours">Daily Work Hours</Label>
                    <Input id="work-hours" type="number" defaultValue="8" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grace-period">Grace Period (Minutes)</Label>
                    <Input id="grace-period" type="number" defaultValue="15" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="half-day">Half Day Hours Threshold</Label>
                    <Input id="half-day" type="number" defaultValue="4" />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Biometric Required</Label>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Auto Mark Absent</Label>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notice Period Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notice-period">Notice Period (Days)</Label>
                    <Select defaultValue="90">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 Days</SelectItem>
                        <SelectItem value="60">60 Days</SelectItem>
                        <SelectItem value="90">90 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="probation-period">Probation Period (Months)</Label>
                    <Input id="probation-period" type="number" defaultValue="3" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buyout-amount">Notice Period Buyout</Label>
                    <Input id="buyout-amount" placeholder="Amount or percentage" defaultValue="1 month salary" />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Allow Early Exit</Label>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Code of Conduct</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Define company code of conduct and behavioral guidelines"
                    rows={6}
                    defaultValue="Employees are expected to maintain professional behavior, respect colleagues, meet deadlines, and follow company policies. Any violation may result in disciplinary action."
                  />
                  <Button className="mt-4 w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Update Code of Conduct
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Privacy Policy</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Define data privacy and confidentiality guidelines"
                    rows={6}
                    defaultValue="All employee and company data must be kept confidential. Unauthorized sharing of sensitive information is strictly prohibited. Use encrypted channels for data transfer."
                  />
                  <Button className="mt-4 w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Update Privacy Policy
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General HR Configuration</CardTitle>
                <CardDescription>Basic HR settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="financial-year">Financial Year Start</Label>
                    <Select defaultValue="april">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="january">January</SelectItem>
                        <SelectItem value="april">April</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select defaultValue="inr">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inr">INR (₹)</SelectItem>
                        <SelectItem value="usd">USD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="week-start">Week Starts On</Label>
                    <Select defaultValue="monday">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunday">Sunday</SelectItem>
                        <SelectItem value="monday">Monday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="ist">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ist">IST (GMT+5:30)</SelectItem>
                        <SelectItem value="est">EST (GMT-5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Email Notifications</Label>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>SMS Notifications</Label>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Push Notifications</Label>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Birthday Reminders</Label>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Anniversary Alerts</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Save General Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}