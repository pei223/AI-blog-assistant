import React, { useState } from 'react'
import {
  AppBar,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import EditIcon from '@mui/icons-material/Edit'
import SettingIcon from '@mui/icons-material/Settings'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

interface SidebarMenu {
  icon: () => React.ReactNode
  link: string
  text: string
  requireInit: boolean
}

const sidebarMenuList: SidebarMenu[] = [
  {
    icon: () => <EditIcon />,
    link: '/generate',
    text: 'ブログ生成',
    requireInit: true
  },
  {
    icon: () => <SettingIcon />,
    link: '/settings',
    text: '設定',
    requireInit: true
  }
]

type Props = {
  children: React.ReactNode
  initialized: boolean
}

const StyledList = styled(List)`
  min-width: 300px;
`

const Layout: React.FC<Props> = ({ children, initialized }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navitate = useNavigate()

  const menues = sidebarMenuList.filter(
    (menu) => !menu.requireInit || initialized
  )
  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton
            onClick={() => {
              setSidebarOpen(!sidebarOpen)
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography marginLeft="20px">AI blog assistant</Typography>
          <Drawer
            open={sidebarOpen}
            onClose={() => {
              setSidebarOpen(false)
            }}
          >
            <StyledList>
              {menues.map((menu) => (
                <ListItem
                  key={menu.link}
                  onClick={() => {
                    navitate(menu.link)
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>{menu.icon()}</ListItemIcon>
                    <ListItemText>{menu.text}</ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
            </StyledList>
          </Drawer>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container>{children}</Container>
    </>
  )
}

export default Layout
