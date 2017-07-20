import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { computed } from 'mobx'
import { AreaChart, Area, PieChart, Pie, Tooltip, Cell } from 'recharts';

import { Card } from '../shared/ui'
import { CustomerStatistics, getGenderStatistics } from '../../domain/customer-statistics'
import { CustomerStore } from '../../domain/customer-store'

const styles = {
  layout: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  newestCustomers: {
    flexGrow: 1,
  }
}

function StatsCard({ title, subtitle, chart }) {
  const statsCardStyles = {
    card: {
      marginBottom: 20,
    },
    layout: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    subtitle: {
      color: 'gray',
    },
    chart: {
      marginLeft: 20,
    },
    titleLayout: {
      alignSelf: 'flex-start',
    }
  }

  return (
    <Card style={statsCardStyles.card}>
      <div style={statsCardStyles.layout}>
        <div style={statsCardStyles.titleLayout}>
          <h4>{title}</h4>
          <span style={statsCardStyles.subtitle}>{subtitle}</span>
        </div>

        <div style={statsCardStyles.chart}>
          {chart}
        </div>        
      </div>

    </Card>
  )
}

interface CustomerStatsProps {
  customerStore?: CustomerStore  
}

@inject('customerStore') @observer
export default class CustomerStats extends React.Component<CustomerStatsProps, {}> {

  @computed get stats(): CustomerStatistics {
    return getGenderStatistics(this.props.customerStore)
  }

  @computed get genderChartData() {
    return [
      { name: 'Männer', value: this.stats.maleCount },
      { name: 'Frauen', value: this.stats.femaleCount },
      { name: 'Kinder', value: this.stats.childCount },
    ]
  }

  render() {
    const customerCountData = [
      { value: 0 },
      { value: 12 },
      { value: 14 },
      { value: 21 },
      { value: 24 },
    ]

    const customerCountChart = (
      <AreaChart width={200} height={100} data={customerCountData}>
        <Area type="monotone" dataKey="value" stroke="#B71C1C" fill="#B71C1C" strokeWidth={2} />          
      </AreaChart>
    )

    const genderColors = [
      '#42A5F5',
      '#EF5350',
      '#FFCA28'
    ]
  
    const genderChart = (
      <PieChart width={150} height={150}>        
        <Pie data={this.genderChartData} dataKey='value' nameKey='name' innerRadius={20} outerRadius={60} fill="#82ca9d" labelline>
          {this.genderChartData.map((entry, index) => <Cell fill={genderColors[index % genderColors.length]}/>)}
        </Pie>
        <Tooltip/>
      </PieChart>     
    )

    const regularCustomersColors = [
      '#EF5350',
      'lightgray'
    ]

    const regularCustomersData = [
      { name: 'Stammkunden', value: 65 },
      { name: '', value: 35 },
    ]

    const regularCustomersChart = (
      <PieChart width={150} height={150}>        
        <Pie data={regularCustomersData} dataKey='value' nameKey='name' innerRadius={20} outerRadius={60} fill="#82ca9d" labelline>
          {regularCustomersData.map((entry, index) => <Cell fill={regularCustomersColors[index % regularCustomersColors.length]}/>)} 
        </Pie>
        <Tooltip/>
      </PieChart>     
    )

    return (
      <div style={styles.layout}>
        <StatsCard 
          title='Alle Kunden'
          subtitle={`${this.stats.count} Kunden`}  
          chart={customerCountChart}      
        />
        <StatsCard 
          title='Geschlecht'
          subtitle={`${this.stats.femaleCount} Frauen, ${this.stats.maleCount} Männer`}
          chart={genderChart}      
        />   
        <StatsCard 
          title='Stammkunden'
          subtitle='65%'  
          chart={regularCustomersChart}      
        />     
        <Card style={styles.newestCustomers}>
          <h4>Neueste Kunden</h4>
        </Card>     
      </div>
    )
  }
}