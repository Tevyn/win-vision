"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/ui/main-layout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Check, X, Phone, Mail, BarChart3, Users } from 'lucide-react'
import { useState } from 'react'

// Mock data for all voters
const allVotersAgeData = [
  { age: '18-24', count: 1250 },
  { age: '25-34', count: 2100 },
  { age: '35-44', count: 2850 },
  { age: '45-54', count: 3200 },
  { age: '55-64', count: 2900 },
  { age: '65+', count: 3100 }
]

const allVotersPartyData = [
  { party: 'Democratic', count: 6200, color: '#2563eb' },
  { party: 'Republican', count: 5800, color: '#dc2626' },
  { party: 'Independent', count: 3400, color: '#16a34a' }
]

const allVotersHouseholdData = [
  { size: '1', count: 4200 },
  { size: '2', count: 5600 },
  { size: '3', count: 3100 },
  { size: '4', count: 2300 },
  { size: '5+', count: 1200 }
]

const allVotersIncomeData = [
  { income: '<$35K', count: 2800 },
  { income: '$35-50K', count: 3200 },
  { income: '$50-75K', count: 4100 },
  { income: '$75-100K', count: 3300 },
  { income: '$100K+', count: 2000 }
]

// Mock data for likely voters
const likelyVotersAgeData = [
  { age: '18-24', count: 280 },
  { age: '25-34', count: 520 },
  { age: '35-44', count: 890 },
  { age: '45-54', count: 1320 },
  { age: '55-64', count: 1680 },
  { age: '65+', count: 2010 }
]

const likelyVotersPartyData = [
  { party: 'Democratic', count: 2850, color: '#2563eb' },
  { party: 'Republican', count: 2540, color: '#dc2626' },
  { party: 'Independent', count: 1310, color: '#16a34a' }
]

const likelyVotersHouseholdData = [
  { size: '1', count: 1890 },
  { size: '2', count: 2640 },
  { size: '3', count: 1420 },
  { size: '4', count: 980 },
  { size: '5+', count: 370 }
]

const likelyVotersIncomeData = [
  { income: '<$35K', count: 1020 },
  { income: '$35-50K', count: 1340 },
  { income: '$50-75K', count: 1890 },
  { income: '$75-100K', count: 1680 },
  { income: '$100K+', count: 1370 }
]

const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#eab308', '#a855f7']

// Mock voter CRM data
const mockVoterData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    address: '123 Oak Street',
    phone: '(555) 123-4567',
    email: 'sarah.johnson@email.com',
    age: 34,
    party: 'Democratic',
    lastContact: '2024-01-15',
    support: null as 'yes' | 'no' | 'undecided' | null,
    notes: 'Interested in education policy'
  },
  {
    id: 2,
    name: 'Michael Chen',
    address: '456 Pine Avenue',
    phone: '(555) 234-5678',
    email: 'mchen@email.com',
    age: 42,
    party: 'Independent',
    lastContact: '2024-01-18',
    support: 'yes' as 'yes' | 'no' | 'undecided' | null,
    notes: 'Supports infrastructure improvements'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    address: '789 Maple Drive',
    phone: '(555) 345-6789',
    email: 'erodriguez@email.com',
    age: 28,
    party: 'Democratic',
    lastContact: '2024-01-20',
    support: 'undecided' as 'yes' | 'no' | 'undecided' | null,
    notes: 'Concerned about affordable housing'
  },
  {
    id: 4,
    name: 'Robert Thompson',
    address: '321 Elm Street',
    phone: '(555) 456-7890',
    email: 'rthompson@email.com',
    age: 56,
    party: 'Republican',
    lastContact: '2024-01-12',
    support: 'no' as 'yes' | 'no' | 'undecided' | null,
    notes: 'Focused on tax reduction'
  },
  {
    id: 5,
    name: 'Jennifer Davis',
    address: '654 Birch Lane',
    phone: '(555) 567-8901',
    email: 'jdavis@email.com',
    age: 39,
    party: 'Independent',
    lastContact: '2024-01-22',
    support: null as 'yes' | 'no' | 'undecided' | null,
    notes: 'New to the area, learning about local issues'
  },
  {
    id: 6,
    name: 'David Wilson',
    address: '987 Cedar Court',
    phone: '(555) 678-9012',
    email: 'dwilson@email.com',
    age: 47,
    party: 'Democratic',
    lastContact: '2024-01-25',
    support: 'yes' as 'yes' | 'no' | 'undecided' | null,
    notes: 'Active in community organizations'
  }
]

interface ChartDataItem {
  [key: string]: string | number | undefined
  color?: string
}

interface ChartCardProps {
  title: string
  description: string
  data: ChartDataItem[]
  type: 'bar' | 'pie'
  dataKey?: string
  nameKey?: string
  colorKey?: string
}

function ChartCard({ title, description, data, type, dataKey = 'count' }: ChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'bar' ? (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={Object.keys(data[0])[0]} />
                <YAxis />
                <Tooltip />
                <Bar dataKey={dataKey} fill="#2563eb" />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent?: number }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey={dataKey}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default function VoterDataPage() {
  const [voters, setVoters] = useState(mockVoterData)

  const updateVoterSupport = (voterId: number, support: 'yes' | 'no' | 'undecided' | null) => {
    setVoters(prevVoters =>
      prevVoters.map(voter =>
        voter.id === voterId ? { ...voter, support } : voter
      )
    )
  }

  const getSupportBadge = (support: 'yes' | 'no' | 'undecided' | null) => {
    if (support === 'yes') return <Badge className="bg-green-100 text-green-800">Supports</Badge>
    if (support === 'no') return <Badge className="bg-red-100 text-red-800">Opposed</Badge>
    if (support === 'undecided') return <Badge className="bg-yellow-100 text-yellow-800">Undecided</Badge>
    return <Badge variant="outline">Not Asked</Badge>
  }

  const getPartyBadge = (party: string) => {
    if (party === 'Democratic') return <Badge className="bg-blue-100 text-blue-800">D</Badge>
    if (party === 'Republican') return <Badge className="bg-red-100 text-red-800">R</Badge>
    return <Badge className="bg-gray-100 text-gray-800">I</Badge>
  }

  return (
    <MainLayout currentPage="voter-data">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Voters</h1>
          <p className="text-lg text-gray-600">
            Comprehensive voter data and analytics for your district
          </p>
        </div>

        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Voter Insights
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Voter List
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-8 mt-8">
            {/* Key Insights */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-xl">Key Insights</CardTitle>
                <CardDescription>Important takeaways from your voter data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Voter Turnout</h4>
                    <p className="text-gray-600">
                      43.5% of registered voters are likely to participate in your election, 
                      which is typical for local elections.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Age Demographics</h4>
                    <p className="text-gray-600">
                      Voters 45+ represent 67% of likely voters, making them your primary target demographic.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Party Balance</h4>
                    <p className="text-gray-600">
                      The district has a slight Democratic lean (42.5% vs 37.9% Republican), 
                      with 19.6% independents being crucial swing voters.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Household Economics</h4>
                    <p className="text-gray-600">
                      Middle-income households ($50-100K) represent 52% of likely voters, 
                      indicating economic issues will resonate strongly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* All Voters Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">All Voters</h2>
                  <p className="text-gray-600">Complete voter registration data for your district</p>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  15,400 Total Voters
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartCard
                  title="Age Distribution"
                  description="Voter breakdown by age groups"
                  data={allVotersAgeData}
                  type="bar"
                />
                <ChartCard
                  title="Party Affiliation"
                  description="Voter registration by party"
                  data={allVotersPartyData}
                  type="pie"
                />
                <ChartCard
                  title="Household Size"
                  description="Number of people per household"
                  data={allVotersHouseholdData}
                  type="bar"
                />
                <ChartCard
                  title="Income Level"
                  description="Estimated household income distribution"
                  data={allVotersIncomeData}
                  type="bar"
                />
              </div>
            </div>

            {/* Likely Voters Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">People Likely to Vote in Your Election</h2>
                  <p className="text-gray-600">Voters with high probability of participating in local elections</p>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  6,700 Likely Voters
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartCard
                  title="Age Distribution"
                  description="Likely voter breakdown by age groups"
                  data={likelyVotersAgeData}
                  type="bar"
                />
                <ChartCard
                  title="Party Affiliation"
                  description="Likely voter registration by party"
                  data={likelyVotersPartyData}
                  type="pie"
                />
                <ChartCard
                  title="Household Size"
                  description="Number of people per household"
                  data={likelyVotersHouseholdData}
                  type="bar"
                />
                <ChartCard
                  title="Income Level"
                  description="Estimated household income distribution"
                  data={likelyVotersIncomeData}
                  type="bar"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-6 mt-8">
            <div className="max-w-full">
              {/* Voter CRM Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Voter Contact Management</CardTitle>
                  <CardDescription>Track voter outreach and support levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[120px]">Name</TableHead>
                          <TableHead className="min-w-[120px]">Address</TableHead>
                          <TableHead className="min-w-[160px]">Contact</TableHead>
                          <TableHead className="min-w-[50px]">Age</TableHead>
                          <TableHead className="min-w-[60px]">Party</TableHead>
                          <TableHead className="min-w-[80px]">Last Contact</TableHead>
                          <TableHead className="min-w-[80px]">Support</TableHead>
                          <TableHead className="min-w-[100px]">Actions</TableHead>
                          <TableHead className="min-w-[150px]">Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {voters.map((voter) => (
                          <TableRow key={voter.id}>
                            <TableCell className="font-medium">{voter.name}</TableCell>
                            <TableCell className="text-sm text-gray-600">{voter.address}</TableCell>
                            <TableCell>
                              <div className="flex flex-col space-y-1">
                                <div className="flex items-center text-sm">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {voter.phone}
                                </div>
                                <div className="flex items-center text-sm">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {voter.email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{voter.age}</TableCell>
                            <TableCell>{getPartyBadge(voter.party)}</TableCell>
                            <TableCell className="text-sm">{voter.lastContact}</TableCell>
                            <TableCell>{getSupportBadge(voter.support)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  variant={voter.support === 'yes' ? 'default' : 'outline'}
                                  onClick={() => updateVoterSupport(voter.id, voter.support === 'yes' ? null : 'yes')}
                                  className="px-2"
                                >
                                  <Check className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant={voter.support === 'no' ? 'default' : 'outline'}
                                  onClick={() => updateVoterSupport(voter.id, voter.support === 'no' ? null : 'no')}
                                  className="px-2"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant={voter.support === 'undecided' ? 'default' : 'outline'}
                                  onClick={() => updateVoterSupport(voter.id, voter.support === 'undecided' ? null : 'undecided')}
                                  className="px-2"
                                >
                                  ?
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600 max-w-[200px] truncate">
                              {voter.notes}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="text-sm text-gray-600">
                      {voters.filter(v => v.support === 'yes').length} supporters,{' '}
                      {voters.filter(v => v.support === 'no').length} opposed,{' '}
                      {voters.filter(v => v.support === 'undecided').length} undecided,{' '}
                      {voters.filter(v => v.support === null).length} not contacted
                    </div>
                    <Button>Add New Voter</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
} 