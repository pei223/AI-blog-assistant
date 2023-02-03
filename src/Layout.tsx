import React, { useState } from "react";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface SidebarMenu {
  icon: () => React.ReactNode;
  link: string;
  text: string;
}

const sidebarMenuList: SidebarMenu[] = [
  {
    icon: () => <SettingIcon />,
    link: "/settings",
    text: "設定",
  },
];

type Props = {
  children: React.ReactNode;
};

const StyledList = styled(List)`
  min-width: 300px;
`;

const Layout: React.FC<Props> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navitate = useNavigate();
  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton
            onClick={() => {
              setSidebarOpen(!sidebarOpen);
            }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            open={sidebarOpen}
            onClose={() => {
              setSidebarOpen(false);
            }}
          >
            <StyledList>
              {sidebarMenuList.map((menu) => (
                <ListItem
                  key={menu.link}
                  onClick={() => {
                    navitate(menu.link);
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
  );
};

export default Layout;
