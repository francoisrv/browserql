import Paper from '@material-ui/core/Paper'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import React from 'react'

export interface TabNavProps {
  tabs: {
    tab: string
    component: React.ComponentType
  }[]
  selected?: number
}

export default function TabNav({ tabs, selected }: TabNavProps) {
  const [selectedTab, setSelectedTab] = React.useState(selected)
  return (
    <div>
      <Tabs
        variant="fullWidth"
        indicatorColor="primary"
        value={selectedTab}
        onChange={(_event: React.ChangeEvent<{}>, tab: number) =>
          setSelectedTab(tab)
        }
      >
        {tabs.map(({ tab }) => (
          <Tab key={tab} label={tab} />
        ))}
      </Tabs>
      <Paper elevation={0} style={{ background: '#eee' }}>
        {tabs.map((tab, index) => (
          <div
            key={index}
            style={{ display: selectedTab === index ? 'block' : 'none' }}
          >
            <tab.component />
          </div>
        ))}
      </Paper>
    </div>
  )
}

TabNav.defaultProps = {
  selected: 0,
}
