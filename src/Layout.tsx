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
import BorderColorIcon from '@mui/icons-material/BorderColor'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
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
    icon: () => <BorderColorIcon />,
    link: '/generate-long-text',
    text: '長文ブログ生成',
    requireInit: true
  },
  {
    icon: () => <SettingIcon />,
    link: '/settings',
    text: '設定',
    requireInit: true
  },
  {
    icon: () => <ArrowBackIcon />,
    link: '/',
    text: '初期設定に戻る',
    requireInit: true
  }
]

type Props = {
  children?: React.ReactNode
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
            color="inherit"
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
              <ListItem>
                <ListItemText>
                  <Typography variant="body1" sx={{ ml: 2, mt: 4 }}>
                    Version {import.meta.env.APP_VERSION}
                  </Typography>
                </ListItemText>
              </ListItem>
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
